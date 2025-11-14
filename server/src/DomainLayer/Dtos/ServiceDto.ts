import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsNumber()
  businessId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  isActive?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;
}

export class ServiceFilterDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  businessId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
