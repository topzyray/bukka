import { Injectable } from '@nestjs/common';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { FileUploadProviderEnum } from 'src/DomainLayer/Enums/FileUploadProviderEnum';
import { LocalDiskProvider } from './providers/LocalDiskProvider';
import { CloudinaryProvider } from './providers/CloudinaryProvider';
import { IFileUploadProvider } from 'src/DataLayer/Abstracts/Interfaces/IFileUploadProvider';

@Injectable()
export class FileFactory {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly localDiskProvider: LocalDiskProvider,
    private readonly configService: AppConfigurationService,
  ) {}

  getProvider(): IFileUploadProvider {
    const provider = this.configService.fileProvider;
    switch (provider) {
      case FileUploadProviderEnum.CLOUDINARY:
        return this.cloudinaryProvider;
      case FileUploadProviderEnum.LOCAL:
        return this.localDiskProvider;
      default:
        throw new Error('Invalid or missing file upload provider');
    }
  }
}
