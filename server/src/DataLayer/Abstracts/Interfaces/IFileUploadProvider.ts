import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';

export interface IFileUploadProvider {
  uploadFile(filePath: string, file: Express.Multer.File): Promise<FileDocDto>;
  uploadStream(
    filePath: string,
    fileName: string,
    fileType: string,
    buffer: Buffer,
    containerName?: string,
  ): Promise<FileDocDto>;
  uploadMultipleFiles(
    basePath: string,
    files: Express.Multer.File[],
    containerName?: string,
  ): Promise<FileDocDto[]>;
  deleteFile(filePath: string): Promise<void>;
  deleteMultipleFiles(filePaths: string[]): Promise<void>;
  getBinaryFile(filePath: string, client_path?: string): Promise<Buffer>;
}
