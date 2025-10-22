import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { Transform } from 'class-transformer';

export class CreateBusinessCategoryDto {
  @ApiProperty({
    example: 'Restaurant',
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
    example: 'Places that sell meals.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://images.com/temiade-kitchen',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}

export class UpdateBusinessCategoryDto extends PartialType(
  CreateBusinessCategoryDto,
) {}

export class FilterBusinessCategoryDto extends PaginationDto {
  @ApiProperty({
    example: 'Temiade Kitchen',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: BusinessTypeEnum.RESTAURANT,
    enum: BusinessTypeEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: BusinessTypeEnum;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  createdBy?: number;
}
