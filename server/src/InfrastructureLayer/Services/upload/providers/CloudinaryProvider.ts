import fetch from 'node-fetch';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IFileUploadProvider } from 'src/DataLayer/Abstracts/Interfaces/IFileUploadProvider';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { RetryHelper } from 'src/InfrastructureLayer/Helpers/RetryHelper';

@Injectable()
export class CloudinaryProvider implements IFileUploadProvider {
  private readonly logger = new Logger(CloudinaryProvider.name);

  constructor(private readonly configService: AppConfigurationService) {
    cloudinary.v2.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

  async uploadFile(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<FileDocDto> {
    return this.uploadStream(
      filePath,
      file.originalname,
      file.mimetype,
      file.buffer,
    );
  }

  async uploadStream(
    filePath: string,
    fileName: string,
    fileType: string,
    buffer: Buffer,
  ): Promise<FileDocDto> {
    const folder = this.configService.cloudinaryFolder || 'bukka';
    const timeoutMs = this.configService.cloudinaryUploadTimeoutMs ?? 30000; // 30s default
    this.logger.log(`Uploading file ${fileName} to Cloudinary (${folder})...`);
    const result = await RetryHelper.withExponentialBackoff<FileDocDto>(
      async () => {
        const publicId = `${filePath}-${Date.now()}`;
        const stream = Readable.from(buffer); // recreate fresh stream per attempt
        return new Promise<FileDocDto>((resolve, reject) => {
          this.logger.log(`Cloudinary: Start file upload.`);
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              folder,
              public_id: publicId,
              resource_type: 'auto',
              timeout: timeoutMs,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              if (!result) {
                return reject(
                  new Error('Cloudinary upload returned no result'),
                );
              }
              resolve({
                fileName,
                fileType,
                filePath: result.public_id,
                fileExtension: result.format,
                blobUrl: result.secure_url,
              });
            },
          );

          // Guard: handle stream errors
          uploadStream.on('error', (err) => {
            reject(err);
          });

          stream.on('error', (err) => {
            reject(err);
          });

          // Pipe the file buffer into Cloudinary
          stream.pipe(uploadStream);
        });
      },
      3,
      300,
    ); // 3 attempts, base delay 300ms → 300 / 600 / 1200 + jitter
    this.logger.log(`Upload complete: ${result.filePath}`);
    return result;
  }

  async uploadMultipleFiles(
    basePath: string,
    files: Express.Multer.File[],
  ): Promise<FileDocDto[]> {
    if (!files?.length) {
      throw new BadRequestException('No files provided for upload.');
    }

    const results: FileDocDto[] = [];

    for (const [index, file] of files.entries()) {
      try {
        const filePath = `${basePath}/${Date.now()}_${index}`;
        const uploaded = await this.uploadFile(filePath, file);
        results.push(uploaded);
      } catch (error: any) {
        console.error(
          `Failed to upload file "${file.originalname}" to Cloudinary:`,
          error.message,
        );
        continue; // Skip and continue others
      }
    }

    return results;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      this.logger.log(`Cloudinary: Delete file with path = ${filePath}`);

      // Accept either "bukka/user-xxx" OR "user-xxx". We'll try full first (as stored public_id),
      // then try with folder prefix if first attempt yields not found.
      const folder = this.configService.cloudinaryFolder || 'bukka';

      const tryDestroy = (publicId: string) =>
        new Promise<any>((resolve, reject) => {
          cloudinary.v2.uploader.destroy(
            publicId,
            { resource_type: 'image' }, // or 'auto' if you upload different types
            (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            },
          );
        });

      // First try the filePath as-is (assuming it's the stored public_id)
      try {
        const res = await tryDestroy(filePath);
        this.logger.log(
          `Cloudinary destroy result for '${filePath}': ${JSON.stringify(res)}`,
        );
        // Some possible results: { result: 'ok' } or { result: 'not_found' } etc.
        if (res?.result === 'ok') {
          this.logger.log(
            `Cloudinary: File '${filePath}' deleted successfully`,
          );
          return;
        }
        // If not found, fall through to try alternate path
      } catch (err) {
        this.logger.warn(
          `Cloudinary destroy attempt for '${filePath}' failed: ${err?.message || err}`,
        );
        // Continue to fallback attempts
      }

      // Fallback: if filePath doesn't start with folder prefix, try with folder
      if (!filePath.startsWith(`${folder}/`)) {
        const withFolder = `${folder}/${filePath}`;
        try {
          const res2 = await tryDestroy(withFolder);
          this.logger.log(
            `Cloudinary destroy result for '${withFolder}': ${JSON.stringify(res2)}`,
          );
          if (res2?.result === 'ok') {
            this.logger.log(
              `Cloudinary: File '${withFolder}' deleted successfully (fallback)`,
            );
            return;
          }
        } catch (err) {
          this.logger.error(
            `Cloudinary destroy fallback failed for '${withFolder}': ${err?.message || err}`,
          );
        }
      }

      // If reached here, we couldn't delete — log
      this.logger.warn(
        `Cloudinary: Unable to confirm deletion for '${filePath}'.`,
      );
    } catch (error) {
      this.logger.error('Cloudinary delete error:', error);
      throw error; // rethrow so callers know deletion failed (they can choose to delete DB record only after success)
    }
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    try {
      await Promise.all(filePaths.map((path) => this.deleteFile(path)));
    } catch (error) {
      this.logger.error('Cloudinary bulk delete error:', error);
    }
  }

  async getBinaryFile(filePath: string): Promise<Buffer> {
    try {
      const fileUrl = cloudinary.v2.url(filePath, { secure: true });
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new NotFoundException(
          `Error fetching file: ${response.statusText}`,
        );
      }
      const buffer = await response.buffer();
      return buffer;
    } catch (error) {
      this.logger.error('Error fetching binary from Cloudinary:', error);
      throw new Error('Failed to get binary file from Cloudinary');
    }
  }
}
