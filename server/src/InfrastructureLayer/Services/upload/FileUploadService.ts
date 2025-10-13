import { Injectable } from '@nestjs/common';
import { FileStreamDto } from 'src/DomainLayer/Dtos/FileStreamDto';
import { FileDocDto } from 'src/DomainLayer/Dtos/Base/FileDocDto';
import { FileFactory } from './FileFactory';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';

@Injectable()
export class FileUploadService {
  constructor(private readonly providerFactory: FileFactory) {}

  async uploadFile(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<BukkaResponse<any>> {
    const provider = this.providerFactory.getProvider();
    const uploadResponse = await provider.uploadFile(filePath, file);
    return BukkaResponse.createResponse('File', uploadResponse);
  }

  async uploadAsStream(streamData: FileStreamDto): Promise<FileDocDto> {
    const provider = this.providerFactory.getProvider();
    return await provider.uploadStream(
      streamData.filePath,
      streamData.fileName,
      streamData.fileType,
      streamData.buffer,
    );
  }

  async uploadMultipleFilesAsStream(
    files: FileStreamDto[],
  ): Promise<FileDocDto[]> {
    const provider = this.providerFactory.getProvider();
    return await Promise.all(
      files.map((file) =>
        provider.uploadStream(
          file.filePath,
          file.fileName,
          file.fileType,
          file.buffer,
        ),
      ),
    );
  }

  async deleteFile(filePath: string): Promise<BukkaResponse<any>> {
    console.log('FILE PATH TO DELETE: ', filePath);
    const provider = this.providerFactory.getProvider();
    await provider.deleteFile(filePath);
    return BukkaResponse.deleteResponse('File', true);
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    const provider = this.providerFactory.getProvider();
    return await provider.deleteMultipleFiles(filePaths);
  }

  async getBinaryFile(filePaths: string[]): Promise<void> {
    const provider = this.providerFactory.getProvider();
    return await provider.deleteMultipleFiles(filePaths);
  }
}
