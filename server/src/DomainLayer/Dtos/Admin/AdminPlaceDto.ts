import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsNotEmpty,
  IsEnum,
  IsLongitude,
  IsLatitude,
  ValidationArguments,
} from 'class-validator';
import { BusinessTypeEnum } from 'src/DomainLayer/Enums/BusinessTypeEnum';
import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';

function safeFloatTransform({ value }: { value: any }) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function safeIntTransform({ value }: { value: any }) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number.parseInt(value, 10);
  return Number.isFinite(num) ? num : undefined;
}

export class AdminPlaceSearchDto {
  @ApiProperty({
    example: PlaceProviderEnum.GEOAPIFY,
    required: true,
    description: 'Provider for place search',
  })
  @IsEnum(PlaceProviderEnum, {
    message: (args: ValidationArguments) =>
      `'provider' must be one of: ${Object.values(PlaceProviderEnum).join(', ')}`,
  })
  provider: PlaceProviderEnum;

  @ApiProperty({
    example: BusinessTypeEnum.RESTAURANT,
    required: true,
    description: 'Business category to filter results',
  })
  @IsEnum(BusinessTypeEnum, {
    message: (args: ValidationArguments) =>
      `'category' must be one of: ${Object.values(BusinessTypeEnum).join(', ')}`,
  })
  category: BusinessTypeEnum;

  @ApiProperty({
    example: 1.546346,
    required: false,
    description: 'Latitude (-90 to 90)',
  })
  @Transform(safeFloatTransform)
  @IsNotEmpty()
  @IsLatitude({
    message: "'lat' must be a valid latitude number between -90 and 90",
  })
  lat: number;

  @ApiProperty({
    example: 1.546746,
    required: false,
    description: 'Longitude (-180 to 180)',
  })
  @Transform(safeFloatTransform)
  @IsNotEmpty()
  @IsLongitude({
    message: "'lng' must be a valid longitude number between -180 and 180",
  })
  lng: number;

  @ApiProperty({
    example: 200,
    required: false,
    description: 'Search radius in meters (minimum: 100)',
  })
  @Transform(safeIntTransform)
  @IsNotEmpty()
  @IsInt({ message: "'radius' must be a whole number (integer)" })
  @Min(100, { message: "'radius' must be at least 100 meters" })
  radius: number;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Maximum number of returned places',
  })
  @Transform(safeIntTransform)
  @IsNotEmpty()
  @IsInt({ message: "'limit' must be an integer" })
  limit: number;

  @ApiProperty({
    example: 'nice restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string;
}

export class AdminPlaceImportDto {
  @ApiProperty({ example: PlaceProviderEnum.GEOAPIFY, required: true })
  @IsNotEmpty()
  @IsEnum(PlaceProviderEnum)
  provider: PlaceProviderEnum;

  @ApiProperty({ example: 'external_id_1234', required: true })
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @ApiProperty({ example: 1, required: true })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  categoryId: number;

  @ApiProperty({ example: 1, required: true })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  recommendedByUserId: number;

  @ApiProperty({ example: 'create', required: false })
  @IsOptional()
  @IsEnum(['create', 'update'])
  importMode?: 'create' | 'update';
}
