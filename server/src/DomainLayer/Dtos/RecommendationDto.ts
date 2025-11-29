import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateLocationDto } from './LocationDto';
import { PaginationDto } from './Base/PaginationDto';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { RecommendationStatusEnum } from '../Enums/RecommendationStatuEnum';

export class CreateRecommendationDto extends CreateLocationDto {
  @ApiProperty({ example: 'New Cafe', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: BusinessTypeEnum.RESTAURANT, required: true })
  @IsNotEmpty()
  @IsString()
  type: BusinessTypeEnum;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  categoryId: number;

  @ApiProperty({ example: 'A cozy place', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Please verify this', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: ['cafe', 'coffee'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisines?: string[];

  @ApiProperty({ example: '+2347035527946', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'hello@newcafe.com', required: false })
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
}

export class UpdateRecommendationDto extends PartialType(
  CreateRecommendationDto,
) {}

export class FilterRecommendationDto extends PaginationDto {
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
  type?: BusinessTypeEnum;

  @ApiProperty({ example: RecommendationStatusEnum.PENDING, required: false })
  @IsOptional()
  @IsString()
  status?: RecommendationStatusEnum;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  recommenderId?: number;
}
