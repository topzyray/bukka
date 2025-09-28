import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  id: number;

  @ApiProperty({ example: 3, description: 'New order index' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  order: number;
}
