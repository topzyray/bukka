import fetch from 'node-fetch';
import cloudinary from 'cloudinary';
import { nanoid } from 'nanoid';
import { Readable } from 'stream';
import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FileHelper } from 'src/InfrastructureLayer/Helpers/FileHelper';
import { IFileUploadProvider } from 'src/DataLayer/Abstracts/Interfaces/IFileUploadProvider';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class CloudinaryProvider implements IFileUploadProvider {
  private readonly logger = new Logger();

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
      Readable.from(file.buffer),
    );
  }

  async uploadStream(
    filePath: string,
    fileName: string,
    fileType: string,
    stream: Readable,
  ): Promise<FileDocDto> {
    return new Promise((resolve, reject) => {
      const publicId = `${filePath}-${Date.now()}-${nanoid(6)}`;

      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: this.configService.cloudinaryFolder || 'bukka',
          public_id: publicId,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary stream upload error:', error);
            return reject(error);
          }

          resolve({
            fileName,
            fileType,
            filePath: result?.public_id,
            fileExtension: result?.format,
            blobUrl: result?.secure_url,
          });
        },
      );

      stream.pipe(uploadStream);
    });
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await cloudinary.v2.uploader.destroy(filePath);
    } catch (error) {
      this.logger.error('Cloudinary delete error:', error);
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
