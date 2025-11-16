import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './Base/PaginationDto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId: number;

  @ApiProperty({ example: 'Outdoor cooking service', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Details about the service', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 600.04, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  price: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  duration?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(value.toLowerCase());
    }
    return false;
  })
  isActive?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  serviceId: number;
}

export class ServiceFilterDto extends PaginationDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(value.toLowerCase());
    }
    return false;
  })
  isActive?: boolean;
}
