import { promises as fs } from 'fs';
import * as path from 'path';
import { IFileUploadProvider } from 'src/DataLayer/Abstracts/Interfaces/IFileUploadProvider';
import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';
import { FileHelper } from 'src/InfrastructureLayer/Helpers/FileHelper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { Readable } from 'stream';

export class LocalDiskProvider implements IFileUploadProvider {
  private uploadRoot: string;

  constructor(private readonly configService: AppConfigurationService) {
    this.uploadRoot = process.env.LOCAL_STORAGE_PATH || path.resolve('uploads');
  }

  async uploadFile(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<FileDocDto> {
    const dirPath = path.join(this.uploadRoot, path.dirname(filePath));
    await fs.mkdir(dirPath, { recursive: true });

    const fullPath = path.join(
      this.uploadRoot,
      `${filePath}.${FileHelper.getFileExtension(file)}`,
    );
    await fs.writeFile(fullPath, file.buffer);

    return {
      fileName: file.originalname,
      fileType: file.mimetype,
      filePath: fullPath,
      fileExtension: FileHelper.getFileExtension(file) as string,
      blobUrl: `${process.env.OWO_DOCUMENT_URL || 'http://localhost:3000'}/${fullPath}`, // static serving URL
    };
  }

  async uploadStream(
    filePath: string,
    fileName: string,
    fileType: string,
    stream: Readable,
  ): Promise<FileDocDto> {
    const dirPath = path.join(this.uploadRoot, path.dirname(filePath));
    await fs.mkdir(dirPath, { recursive: true });

    const fullPath = path.join(this.uploadRoot, filePath);

    const writeStream = await fs.open(fullPath, 'w');
    await new Promise<void>((resolve, reject) => {
      const writable = writeStream.createWriteStream();
      stream.pipe(writable);
      stream.on('end', () => {
        writable.close();
        resolve();
      });
      stream.on('error', reject);
    });

    return {
      fileName,
      fileType,
      filePath: fullPath,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadRoot, filePath);
    await fs.unlink(fullPath).catch(() => {
      console.warn(`File not found: ${fullPath}`);
    });
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    await Promise.all(filePaths.map((fp) => this.deleteFile(fp)));
  }

  async getBinaryFile(filePath: string, client_path?: string): Promise<Buffer> {
    try {
      // if client_path is given, use it as root, otherwise use configured upload root
      const rootPath = client_path
        ? path.resolve(this.uploadRoot, client_path)
        : this.uploadRoot;

      const fullPath = path.join(rootPath, filePath);

      // check if file exists
      try {
        await fs.access(fullPath);
      } catch {
        throw new Error(`File not found: ${fullPath}`);
      }

      // read and return as buffer
      const buffer = await fs.readFile(fullPath);
      return buffer;
    } catch (error) {
      throw new Error('Error reading binary file:', error);
    }
  }
}
