import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';
import { FileDataAgent } from 'src/DataLayer/DataAgents/FileDataAgent';
import {
  CreateFileDto,
  CreateMultipleFilesDto,
  FileFilterDto,
  UserFileFilterDto,
} from 'src/DomainLayer/Dtos/FileDto';
import { FileCategoryEnum } from 'src/DomainLayer/Enums/FileCategoryEnum';
import { FileReferenceTypeEnum } from 'src/DomainLayer/Enums/FileReferenceTypeEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { File } from 'src/DomainLayer/Models/File';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { FileHelper } from 'src/InfrastructureLayer/Helpers/FileHelper';
import { FileReferenceHelper } from 'src/InfrastructureLayer/Helpers/FileReferenceHelper';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { FileUploadService } from 'src/InfrastructureLayer/Services/upload/FileUploadService';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';

@Injectable()
export class FileRepository {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly fileDataAgent: FileDataAgent,
    private readonly fileReferenceHelper: FileReferenceHelper,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    filePath: string,
    createFileDto: CreateFileDto,
  ) {
    console.log('FILE: ', file);
    console.log('DTO: ', createFileDto);

    if (!file) {
      throw new BadRequestException('Invalid file or no file attached');
    }

    const loggedInUser = await UserHelper.getLoggedInUser();

    let record: any;

    if (createFileDto.referenceType !== FileReferenceTypeEnum.GENERAL) {
      record = await this.fileReferenceHelper.validateFileReference(
        createFileDto.referenceType as any,
        createFileDto.referenceId as number,
      );
    } else {
      record = null;
    }

    if (createFileDto.category === FileCategoryEnum.USER_PROFILE_IMAGE) {
      await this.handleExistingFileDeletion(
        FileCategoryEnum.USER_PROFILE_IMAGE,
        createFileDto.referenceId as number,
        FileReferenceTypeEnum.USER,
      );
    }

    if (createFileDto.category === FileCategoryEnum.BUSINESS_COVER) {
      await this.handleExistingFileDeletion(
        FileCategoryEnum.BUSINESS_COVER,
        createFileDto.referenceId as number,
        FileReferenceTypeEnum.VENDOR,
      );
    }

    const fileResponse = await this.fileUploadService.uploadFile(
      filePath,
      file,
    );

    if (!fileResponse?.responseData) {
      return BukkaResponse.errorResponse('Error uploading file.');
    }

    const fileData = fileResponse.responseData;

    const newFileData = {
      referenceId:
        createFileDto.referenceType !== FileReferenceTypeEnum.GENERAL
          ? record?.id
          : null,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileExtension: fileData.fileExtension,
      referenceType: createFileDto.referenceType as any,
      category: createFileDto.category as any,
      relativePath: fileData.filePath,
      fullPath: fileData.blobUrl || fileData.filePath,
      createdById: loggedInUser?.id,
      fileSize: file.buffer.length,
      mimeType: file.mimetype,
      isPublic: createFileDto.isPublic || false,
      metadata: createFileDto.metadata,
    } as File;

    const newFile = await this.fileDataAgent.createFile(newFileData);

    if (!newFile) {
      return BukkaResponse.errorResponse('Error saving file to database.');
    }

    return BukkaResponse.createResponse('File', newFile);
  }

  async uploadFilesFromUrls(
    dto: CreateMultipleFilesDto,
  ): Promise<BukkaResponse<File[]>> {
    if (!dto.urls?.length) {
      throw new BadRequestException('No URLs provided.');
    }

    const loggedInUser = await UserHelper.getLoggedInUser();

    let record: any;

    if (dto.referenceType !== FileReferenceTypeEnum.GENERAL) {
      record = await this.fileReferenceHelper.validateFileReference(
        dto.referenceType as any,
        dto.referenceId as number,
      );
    } else {
      record = null;
    }

    const uploadPromises = dto.urls.map(async (url) => {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const buffer = Buffer.from(response.data);
        const stream = Readable.from(buffer);
        const originalFileName = url.split('/').pop() ?? 'unknown';
        const relativePath = `uploads/${FileHelper.generateUniqueFileName()}-${originalFileName}`;

        const uploadResponse = await this.fileUploadService.uploadAsStream({
          filePath: relativePath,
          fileName: originalFileName,
          fileType:
            dto.fileType ??
            response.headers['content-type'] ??
            'application/octet-stream',
          stream,
        });

        return {
          referenceId:
            dto.referenceType !== FileReferenceTypeEnum.GENERAL
              ? record?.id
              : null,
          fileName: originalFileName,
          fileType: response.headers['content-type'] ?? 'image/jpeg',
          fileExtension: dto.fileExtension ?? url?.split('.').pop() ?? 'jpg',
          referenceType: dto.referenceType as any,
          category: dto.category as any,
          fullPath: uploadResponse.filePath,
          relativePath,
          createdById: loggedInUser?.id,
          fileSize: buffer.length,
          mimeType: response.headers['content-type'] ?? 'image/jpeg',
          isPublic: dto.isPublic || false,
        } as File;
      } catch (error) {
        throw new BadRequestException(
          `Failed to download file from URL: ${url}`,
        );
      }
    });

    const uploadedFiles: File[] = await Promise.all(uploadPromises);

    const savedFiles = await Promise.all(
      uploadedFiles.map((fileData) => this.fileDataAgent.createFile(fileData)),
    );

    return BukkaResponse.createResponse('Files', savedFiles);
  }

  async getFileById(fileId: number): Promise<File | null> {
    return await this.fileDataAgent.getFileById(fileId);
  }

  async getFilesByReferenceId(referenceId: number): Promise<File[] | null> {
    return await this.fileDataAgent.getFileByReferenceId(referenceId);
  }

  async getFilesByIds(fileIds: number[]): Promise<File[] | null> {
    const files = await this.fileDataAgent.getFileByIds(fileIds);
    if (!files) {
      throw new NotFoundException('Files not found!');
    }
    return files;
  }

  async getFileByFilters(filterDto: FileFilterDto): Promise<PagedData<File[]>> {
    const { fileId, ...otherFiltersDto } = filterDto;
    const processedFilterDto = {
      ...otherFiltersDto,
      id: fileId,
    };
    const query = FilterQueryHelper.buildQuery({
      dto: processedFilterDto,
      rules: [
        { field: 'id' },
        { field: 'referenceId' },
        { field: 'createdById' },
        { field: 'category' },
        { field: 'referenceType' },
        { field: 'isPublic' },
      ],
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(processedFilterDto);
    return await this.fileDataAgent.getFileByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async getLoggedInUserFiles(
    filterDto: UserFileFilterDto,
  ): Promise<PagedData<File[]>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const { fileId, ...otherFiltersDto } = filterDto;

    const processedFilterDto = {
      ...otherFiltersDto,
      id: fileId,
      referenceType: FileReferenceTypeEnum.USER,
      referenceId: loggedInUser?.id,
      createdById: loggedInUser?.id,
    };
    const query = FilterQueryHelper.buildQuery({
      dto: processedFilterDto,
      rules: [
        { field: 'id' },
        { field: 'referenceId' },
        { field: 'createdById' },
        { field: 'category' },
        { field: 'referenceType' },
        { field: 'isPublic' },
      ],
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(processedFilterDto);
    return await this.fileDataAgent.getFileByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async deleteFile(fileId: number, filePath: string) {
    if (!fileId) {
      throw new BadRequestException('File ID is required.');
    }
    if (!filePath) {
      throw new BadRequestException('File path is required.');
    }
    const existingFile = await this.fileDataAgent.getFileById(fileId);

    if (!existingFile) {
      return BukkaResponse.errorResponse(
        `File with ID ${fileId} not found in the database.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.fileUploadService.deleteFile(filePath);
    await this.fileDataAgent.deleteFile(fileId);

    return BukkaResponse.deleteResponse('File', true);
  }

  private async handleExistingFileDeletion(
    category: FileCategoryEnum,
    referenceId: number,
    referenceType: FileReferenceTypeEnum,
  ) {
    const existingFile = await this.fileDataAgent.findOneByCategoryAndReference(
      referenceId,
      category as any,
      referenceType as any,
    );
    console.log('EXISTING FILE: ', existingFile);

    if (existingFile) {
      await this.deleteFile(
        existingFile.id as number,
        existingFile.relativePath,
      );
    }
  }

  async deleteUserFiles(): Promise<BukkaResponse<void>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const files = await this.fileDataAgent.deleteUserFiles(loggedInUser?.id);
    if (files.count === 0) {
      return BukkaResponse.errorResponse(
        'No files found for this user',
        HttpStatus.NOT_FOUND,
      );
    }
    return BukkaResponse.deleteResponse('Files', true);
  }

  async getFilesByReferenceTypeAndId(
    referenceType: FileReferenceTypeEnum,
    referenceId: number,
  ): Promise<File[]> {
    return await this.fileDataAgent.getFilesByReferenceTypeAndId(
      referenceType as any,
      referenceId,
    );
  }
}
