import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  CreateFileDto,
  CreateMultipleFilesDto,
  FileFilterDto,
  DeleteFileDto,
  UserFileFilterDto,
} from 'src/DomainLayer/Dtos/FileDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { FileRepository } from 'src/BussinessLayer/FileRepository';
import { FileReferenceTypeEnum } from 'src/DomainLayer/Enums/FileReferenceTypeEnum';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import type { Response } from 'express';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/files`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('File')
export class FileController {
  constructor(private readonly fileRepository: FileRepository) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file and save to database' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        referenceType: {
          type: 'string',
          enum: ['USER', 'VENDOR', 'GENERAL'],
          example: 'GENERAL',
        },
        referenceId: {
          type: 'number',
          example: 1,
        },
        category: {
          type: 'string',
          example: 'EMAIL_TEMPLATE',
        },
        isPublic: {
          type: 'boolean',
          example: false,
        },
        metadata: {
          type: 'object',
          example: { altText: 'profile photo' },
        },
      },
      required: ['file', 'referenceType', 'category'],
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @Res() res: Response,
  ) {
    const filePath = `${createFileDto.referenceType.toLowerCase()}`;
    const response = await this.fileRepository.uploadFile(
      file,
      filePath,
      createFileDto,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple files and save to database' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        referenceType: {
          type: 'string',
          enum: ['USER', 'VENDOR', 'GENERAL'],
          example: 'GENERAL',
        },

        category: {
          type: 'string',
          enum: ['GENERAL', 'EMAIL_TEMPLATE', 'BUSINESS_COVER', 'GALLERY'],
          example: 'GENERAL',
        },
        referenceId: { type: 'number', example: 1 },
        isPublic: { type: 'boolean', example: false },
        metadata: {
          type: 'object',
          example: { altText: 'menu image' },
        },
      },
      required: ['files', 'referenceType', 'category'],
    },
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateFileDto,
    @Res() res: Response,
  ) {
    const filePath = `${dto.referenceType.toLowerCase()}`;
    const response = await this.fileRepository.uploadMultipleFiles(
      files,
      filePath,
      dto,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Post('upload-multiple-from-urls')
  @ApiOperation({
    summary: 'Upload multiple files from URLs and save to database',
  })
  async uploadFilesFromUrls(
    @Body() dto: CreateMultipleFilesDto,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.uploadFilesFromUrls(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('my-files')
  @ApiOperation({ summary: 'Get paginated files for a logged in user' })
  async getLoggedInUserFiles(
    @Query() filterDto: UserFileFilterDto,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.getLoggedInUserFiles(filterDto);
    const data = BukkaResponse.GetSingleDataResponse('User file', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  async getFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.getFileById(id);
    const data = BukkaResponse.GetSingleDataResponse('File', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get('reference/:referenceId')
  @ApiOperation({ summary: 'Get files by reference ID' })
  async getFilesByReferenceId(
    @Param('referenceId', ParseIntPipe) referenceId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.fileRepository.getFilesByReferenceId(referenceId);
    const data = BukkaResponse.GetSingleDataResponse('File', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get('reference/:referenceType/:referenceId')
  @ApiOperation({ summary: 'Get files by reference type and ID' })
  async getFilesByReferenceTypeAndId(
    @Param('referenceType') referenceType: FileReferenceTypeEnum,
    @Param('referenceId', ParseIntPipe) referenceId: number,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.getFilesByReferenceTypeAndId(
      referenceType as any,
      referenceId,
    );
    const data = BukkaResponse.GetSingleDataResponse('File', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get files with filters' })
  async getFilesByFilters(
    @Query() filterDto: FileFilterDto,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.getFileByFilters(filterDto);
    const data = BukkaResponse.GetPagedDataResponse('Files', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file by ID' })
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteFileDto: DeleteFileDto,
    @Res() res: Response,
  ) {
    const response = await this.fileRepository.deleteFile(
      id,
      deleteFileDto.relativePath,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete('user')
  @ApiOperation({ summary: 'Delete all files for a user' })
  async deleteUserFiles(@Res() res: Response) {
    const response = await this.fileRepository.deleteUserFiles();
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
