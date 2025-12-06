import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';

export class LocationDto {
  @ApiProperty({ example: 3.543245, required: true })
  @IsNotEmpty()
  @IsLatitude()
  @MinLength(1)
  latitude: number;

  @ApiProperty({ example: -43.54355, required: true })
  @IsNotEmpty()
  @IsLongitude()
  @MinLength(1)
  longitude: number;

  @ApiProperty({ example: 'ChIJN1t_tJezz4AR4GeTYWZsKWw', required: true })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @ApiProperty({
    example: 'Laughter`s Youghurt, Immowa Buiding',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'FCT', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ example: 'Sauka Area', required: false })
  @IsString()
  @IsOptional()
  landmark?: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 3.543245, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  latitude: number;

  @ApiProperty({ example: -43.54355, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  longitude: number;

  @ApiProperty({
    example: 'Laughter`s Youghurt, Immowa Buiding',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Abuja', required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'FCT', required: true })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Nigeria', required: true })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'ChIJN1t_tJezz4AR4GeTYWZsKWw', required: false })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({ example: '2643743', required: false })
  @IsString()
  @IsOptional()
  cityId?: string;

  @ApiProperty({ example: 'ENG', required: false })
  @IsString()
  @IsOptional()
  stateId?: string;

  @ApiProperty({ example: 'GB', required: false })
  @IsString()
  @IsOptional()
  countryId?: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ example: 'The Green House', required: false })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiProperty({ example: 'Wuse II', required: false })
  @IsString()
  @IsOptional()
  suburb?: string;

  @ApiProperty({
    example: 'Ilupeju Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({
    example: 'Municipal Area Council',
    required: false,
  })
  @IsString()
  @IsOptional()
  county?: string;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export class FilterLocationDto extends PaginationDto {
  @ApiProperty({ example: 3.543245, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  latitude?: number;

  @ApiProperty({ example: -43.54355, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  longitude?: number;

  @ApiProperty({ example: 'ChIJN1t_tJezz4AR4GeTYWZsKWw', required: false })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({
    example: 'Laughter`s Youghurt, Immowa Buiding',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'FCT', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: '2643743', required: false })
  @IsString()
  @IsOptional()
  cityId?: string;

  @ApiProperty({ example: 'ENG', required: false })
  @IsString()
  @IsOptional()
  stateId?: string;

  @ApiProperty({ example: 'GB', required: false })
  @IsString()
  @IsOptional()
  countryId?: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ example: 'Sauka Area', required: false })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiProperty({ example: 'Search location', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

export class SearchLocationDto extends PaginationDto {
  @ApiProperty({ example: 'Search location', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
