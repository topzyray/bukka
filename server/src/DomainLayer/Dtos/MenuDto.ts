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

export class CreateMenuDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId: number;

  @ApiProperty({ example: 'Chicken Peperoni', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Details about Chicken Peperoni', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500.04, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  price: number;

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

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  menuId: number;
}

export class MenuFilterDto extends PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
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
