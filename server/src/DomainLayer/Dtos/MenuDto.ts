export class CreateMenuDto {
  @IsNumber() businessId: number;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() price: number;
  @IsOptional() isActive?: boolean;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsNotEmpty() @IsNumber() menuId: number;
}

export class MenuFilterDto extends PaginationDto {
  @IsOptional() @IsNumber() businessId?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
