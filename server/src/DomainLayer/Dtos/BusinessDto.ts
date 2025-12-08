import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsObject,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
  IsDecimal,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  IsDate,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { CreateLocationDto } from './LocationDto';

export class CreateBusinessDto extends CreateLocationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  ownerId?: number;

  @ApiProperty({
    example: 'Temiade Kitchen',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: BusinessTypeEnum.RESTAURANT,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: BusinessTypeEnum;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  categoryId: number;

  @ApiProperty({
    example: 'restaurant',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'restaurant',
    required: true,
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toLowerCase() : v));
    }
    return value;
  })
  cuisines: string[] = [];

  @ApiProperty({
    example: 'We provide the best service.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '+2347035527946', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'hello@temiadegroup.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'https://www.temiadegroup.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    example: 'RC-172823434',
    required: false,
  })
  @IsOptional()
  @IsString()
  registrationNo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  openingHours?: {};

  @ApiProperty({
    example: {
      instagram: 'https://instagram.com/temiadegroup',
      facebook: 'https://facebook.com/temiadegroup',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  socialLinks?: {};
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}

export class AddFeatureBusinessDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'Whether the business should be marked as featured',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  })
  isFeatured: boolean;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Rank used for sorting featured businesses',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  featuredRank?: number;

  @ApiProperty({
    example: '2025-01-30T00:00:00Z',
    required: false,
    description: 'End date for the feature period',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  featuredEnd?: Date;
}

export class FilterBusinessDto extends PaginationDto {
  @ApiProperty({
    example: 'Temiade Kitchen',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: BusinessTypeEnum.RESTAURANT,
    required: true,
  })
  @IsOptional()
  @IsString()
  type: BusinessTypeEnum;
}

export class FilterFeaturedBusinessDto extends PaginationDto {}

export class BusinessWithinDistanceDto extends PaginationDto {
  @ApiProperty({ example: 37.7749, required: false })
  @IsOptional()
  @IsLongitude()
  latitude?: number;

  @ApiProperty({ example: -12.4194, required: false })
  @IsOptional()
  @IsLatitude()
  longitude?: number;

  @ApiProperty({
    example: 10.5,
    required: false,
    description: 'Search radius in km',
  })
  @IsOptional()
  @IsDecimal()
  radiusInKm?: number;
}
