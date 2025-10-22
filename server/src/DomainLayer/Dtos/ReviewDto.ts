import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Max,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'This is the best bukka I have ever seen',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

export class ReviewFilterDto extends PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  rating?: number;
}
