import { ApiProperty } from '@nestjs/swagger';
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
  placeId: string;

  @ApiProperty({
    example: 'Habeeb Youghurt, Immova Buiding',
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ example: 'FCT', required: false })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 3.543245, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  latitude: number;

  @ApiProperty({ example: -43.54355, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  longitude: number;

  @ApiProperty({ example: 'ChIJN1t_tJezz4AR4GeTYWZsKWw', required: true })
  @IsString()
  placeId: string;

  @ApiProperty({
    example: 'Habeeb Youghurt, Immova Buiding',
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ example: 'FCT', required: false })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: '2643743', required: false })
  @IsString()
  @IsOptional()
  cityId: string;

  @ApiProperty({ example: 'ENG', required: false })
  @IsString()
  @IsOptional()
  stateId: string;

  @ApiProperty({ example: 'GB', required: false })
  @IsString()
  @IsOptional()
  countryId: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode: string;
}

export class UpdateLocationDto {
  @ApiProperty({ example: 3.5433245, required: false })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 3.5433245, required: false })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: 'Habeeb Youghurt, Immova Buiding', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ example: 'FCT', required: false })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: '20021', required: false })
  @IsString()
  @IsOptional()
  zipCode: string;
}
