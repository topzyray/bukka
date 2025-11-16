import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './Base/PaginationDto';
import { OrderStatusEnum } from '../Enums/OrderStatusEnum';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  vendorId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  riderId?: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseFloat(value))
  totalAmount: number;

  @ApiProperty({ example: 1, required: true })
  @IsArray()
  @IsNotEmpty()
  items: any[];

  @ApiProperty({ example: 'Adekunle Street, Kuje', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '2025-10-01', required: false })
  @IsDateString()
  @IsOptional()
  deliveryTime?: Date;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  orderId: number;

  @ApiProperty({
    example: OrderStatusEnum.PENDING,
    enum: OrderStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: OrderStatusEnum;
}

export class OrderFilterDto extends PaginationDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId?: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  vendorId?: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  businessId?: number;

  @ApiProperty({
    example: OrderStatusEnum.PENDING,
    enum: OrderStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: OrderStatusEnum;
}
