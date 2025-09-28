import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  pageNumber: number = 1;

  @ApiProperty({ example: 10, default: 10 })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  pageSize: number = 10;
}
