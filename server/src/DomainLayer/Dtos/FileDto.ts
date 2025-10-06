import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  ArrayMinSize,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { FileCategoryEnum } from '../Enums/FileCategoryEnum';
import { FileReferenceTypeEnum } from '../Enums/FileReferenceTypeEnum';
import { PaginationDto } from './Base/PaginationDto';

export class CreateFileDto {
  @ApiProperty({
    example: FileReferenceTypeEnum.USER,
    enum: FileReferenceTypeEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FileReferenceTypeEnum)
  referenceType: FileReferenceTypeEnum;

  @ApiProperty({
    example: FileCategoryEnum.USER_PROFILE_IMAGE,
    enum: FileCategoryEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FileCategoryEnum)
  category: FileCategoryEnum;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsOptional()
  referenceId?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(value.toLowerCase());
    }
    return false;
  })
  isPublic?: boolean;

  @ApiProperty({ example: { description: 'File metadata' }, required: false })
  @IsOptional()
  metadata?: any;
}

export class CreateMultipleFilesDto {
  @ApiProperty({
    example: FileCategoryEnum.USER_PROFILE_IMAGE,
    enum: FileCategoryEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FileCategoryEnum)
  category: FileCategoryEnum;

  @ApiProperty({
    example: FileReferenceTypeEnum.USER,
    enum: FileReferenceTypeEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FileReferenceTypeEnum)
  referenceType: FileReferenceTypeEnum;

  @ApiProperty({
    example: 3,
    description: 'Reference ID (e.g., card ID)',
    required: false,
  })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  referenceId?: number;

  @ApiProperty({
    example: 'image/jpeg',
    required: false,
  })
  @IsOptional()
  fileType?: string;

  @ApiProperty({
    example: 'jpg',
    required: false,
  })
  @IsOptional()
  fileExtension?: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of file URLs',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  urls: string[];

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(value.toLowerCase());
    }
    return false;
  })
  isPublic?: boolean;
}

export class FileFilterDto extends PaginationDto {
  @ApiProperty({
    example: FileCategoryEnum.USER_PROFILE_IMAGE,
    enum: FileCategoryEnum,
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: FileCategoryEnum;

  @ApiProperty({
    example: FileReferenceTypeEnum.USER,
    enum: FileReferenceTypeEnum,
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceType?: FileReferenceTypeEnum;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsOptional()
  referenceId?: number;

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsOptional()
  fileId?: number;

  @ApiProperty({ example: 'user123', required: false })
  @IsString()
  @IsOptional()
  createdById?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class DeleteFileDto {
  @ApiProperty({
    example: 'uploads/file.jpg',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  relativePath: string;
}
