export class CreateOrderDto {
  @IsNumber() userId: number;
  @IsNumber() vendorId: number;
  @IsNumber() businessId: number;
  @IsOptional() @IsNumber() riderId?: number;
  @IsNumber() totalAmount: number;
  @IsArray() items: any[];
  @IsOptional() @IsString() address?: string;
  @IsOptional() deliveryTime?: Date;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty() @IsNumber() orderId: number;
  @IsOptional() status?: OrderStatus;
}

export class OrderFilterDto extends PaginationDto {
  @IsOptional() @IsNumber() userId?: number;
  @IsOptional() @IsNumber() vendorId?: number;
  @IsOptional() @IsNumber() businessId?: number;
  @IsOptional() status?: OrderStatus;
}
