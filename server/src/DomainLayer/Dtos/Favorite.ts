import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';

export class CreateFavoriteDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;
}

export class FavoriteFilterDto extends PaginationDto {}
