import { promises as fs } from 'fs';
import * as path from 'path';
import { IFileUploadProvider } from 'src/DataLayer/Abstracts/Interfaces/IFileUploadProvider';
import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';
import { FileHelper } from 'src/InfrastructureLayer/Helpers/FileHelper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RetryHelper } from 'src/InfrastructureLayer/Helpers/RetryHelper';
import { FileValidationHelper } from 'src/InfrastructureLayer/Helpers/FileValidationHelper';

export class LocalDiskProvider implements IFileUploadProvider {
  private readonly uploadRoot: string;

  constructor(private readonly configService: AppConfigurationService) {
    this.uploadRoot = process.env.LOCAL_STORAGE_PATH || path.resolve('uploads');
  }

  async uploadFile(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<FileDocDto> {
    const validatedFile =
      await FileValidationHelper.validateAndPrepareFile(file);

    const dirPath = path.join(this.uploadRoot, path.dirname(filePath));
    const extension = FileHelper.getFileExtension(validatedFile) as string;
    const fullPath = path.join(this.uploadRoot, `${filePath}.${extension}`);

    await fs.mkdir(dirPath, { recursive: true });

    await RetryHelper.withExponentialBackoff(async () => {
      await fs.writeFile(fullPath, validatedFile.buffer);
    });

    return this.buildFileDoc(
      validatedFile.originalname,
      validatedFile.mimetype,
      fullPath,
      extension,
    );
  }

  async uploadStream(
    filePath: string,
    fileName: string,
    fileType: string,
    buffer: Buffer,
  ): Promise<FileDocDto> {
    const extension = path.extname(fileName) || 'dat';
    const dirPath = path.join(this.uploadRoot, path.dirname(filePath));
    const fullPath = path.join(
      this.uploadRoot,
      `${filePath}${extension.startsWith('.') ? extension : '.' + extension}`,
    );

    await fs.mkdir(dirPath, { recursive: true });

    await RetryHelper.withExponentialBackoff(async () => {
      await fs.writeFile(fullPath, buffer);
    });

    return this.buildFileDoc(fileName, fileType, fullPath, extension);
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
        const filePath = path.join(basePath, `${Date.now()}_${index}`);
        const uploaded = await this.uploadFile(filePath, file);
        results.push(uploaded);
      } catch (error) {
        console.error(
          `Failed to upload file "${file.originalname}": ${error.message}`,
        );
        // You can decide here to either continue or throw
        continue;
      }
    }

    return results;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadRoot, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.warn(`Failed to delete ${fullPath}: ${error.message}`);
      }
    }
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    await Promise.all(filePaths.map((fp) => this.deleteFile(fp)));
  }

  async getBinaryFile(filePath: string, client_path?: string): Promise<Buffer> {
    const rootPath = client_path
      ? path.resolve(this.uploadRoot, client_path)
      : this.uploadRoot;

    const fullPath = path.join(rootPath, filePath);

    try {
      await fs.access(fullPath);
      return await fs.readFile(fullPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new BadRequestException(`File not found: ${fullPath}`);
      }
      throw new InternalServerErrorException(
        `Failed to read file: ${error.message}`,
      );
    }
  }

  private buildFileDoc(
    fileName: string,
    fileType: string,
    fullPath: string,
    extension: string,
  ): FileDocDto {
    const blobUrl = this.getBlobUrl(fullPath);
    return {
      fileName,
      fileType,
      filePath: fullPath,
      fileExtension: extension.replace('.', ''),
      blobUrl,
    };
  }

  private getBlobUrl(fullPath: string): string {
    const baseUrl = process.env.OWO_DOCUMENT_URL || 'http://localhost:3000';
    const relativePath = path
      .relative(this.uploadRoot, fullPath)
      .replace(/\\/g, '/');
    return `${baseUrl}/uploads/${relativePath}`;
  }
}
