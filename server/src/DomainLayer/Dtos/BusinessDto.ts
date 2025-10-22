import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsObject,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
  IsDecimal,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { CreateLocationDto } from './LocationDto';

export class CreateBusinessDto extends CreateLocationDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  ownerId: number;

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

export class FilterBusinessDto extends PaginationDto {
  @ApiProperty({
    example: 'Temiade Kitchen',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isVerified?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isActive?: boolean;

  @ApiProperty({ example: 37.7749, required: false })
  @IsOptional()
  @IsLongitude()
  latitude?: number;

  @ApiProperty({ example: -12.4194, required: false })
  @IsOptional()
  @IsLatitude()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;
}

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
