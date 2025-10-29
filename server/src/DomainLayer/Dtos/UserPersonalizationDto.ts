import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from './Base/PaginationDto';
import { MealPreferenceEnum } from '../Enums/MealPreferenceEnum';
import { DeliveryTimeEnum } from '../Enums/DeliveryTimeEnum';
import { PaymentMethodEnum } from '../Enums/PaymentMethodEnum';
import { DietaryRestrictionEnum } from '../Enums/DietRestrictionEnum';

export class UserPersonalizationDto {
  @ApiProperty({
    example: ['African - Nigerian'],
    isArray: true,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toLowerCase() : v));
    }
    return value;
  })
  preferredCuisines: string[];

  @ApiProperty({
    example: [DietaryRestrictionEnum.VEGETARIAN],
    enum: DietaryRestrictionEnum,
    isArray: true,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(DietaryRestrictionEnum, { each: true })
  dietaryRestrictions: DietaryRestrictionEnum[];

  @ApiProperty({
    example: [MealPreferenceEnum.LUNCH],
    enum: MealPreferenceEnum,
    isArray: true,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(MealPreferenceEnum, { each: true })
  mealPreferences: MealPreferenceEnum[];

  @ApiProperty({
    example: PaymentMethodEnum.CARD,
    enum: PaymentMethodEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentPreference: PaymentMethodEnum;

  @ApiProperty({
    example: DeliveryTimeEnum.AFTERNOON,
    enum: DeliveryTimeEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliveryTimeEnum)
  preferredDeliveryTime?: DeliveryTimeEnum;

  @ApiProperty({ example: 'Peanuts', required: false })
  @IsOptional()
  @IsString()
  allergies?: string;
}

export class CreateUserPersonalizationDto extends UserPersonalizationDto {}

export class UpdateUserPersonalizationDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  personalizationId: number;

  @ApiProperty({ example: ['African - Nigerian'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toLowerCase() : v));
    }
    return value;
  })
  preferredCuisines?: string[];

  @ApiProperty({
    example: [DietaryRestrictionEnum.VEGETARIAN],
    enum: DietaryRestrictionEnum,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DietaryRestrictionEnum, { each: true })
  dietaryRestrictions?: DietaryRestrictionEnum[];

  @ApiProperty({
    example: [MealPreferenceEnum.LUNCH],
    enum: MealPreferenceEnum,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MealPreferenceEnum, { each: true })
  mealPreferences?: MealPreferenceEnum[];

  @ApiProperty({
    example: PaymentMethodEnum.CARD,
    enum: PaymentMethodEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentPreference?: PaymentMethodEnum;

  @ApiProperty({
    example: DeliveryTimeEnum.AFTERNOON,
    enum: DeliveryTimeEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliveryTimeEnum)
  preferredDeliveryTime?: DeliveryTimeEnum;

  @ApiProperty({ example: 'Peanuts', required: false })
  @IsOptional()
  @IsString()
  allergies?: string;
}

export class UserPersonalizationFilterDto extends PaginationDto {
  @ApiProperty({ example: ['African - Nigerian'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toLowerCase() : v));
    }
    return value;
  })
  preferredCuisines?: string[];

  @ApiProperty({
    example: [DietaryRestrictionEnum.VEGETARIAN],
    enum: DietaryRestrictionEnum,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DietaryRestrictionEnum, { each: true })
  dietaryRestrictions?: DietaryRestrictionEnum[];

  @ApiProperty({
    example: [MealPreferenceEnum.LUNCH],
    enum: MealPreferenceEnum,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MealPreferenceEnum, { each: true })
  mealPreferences?: MealPreferenceEnum[];

  @ApiProperty({
    example: PaymentMethodEnum.CARD,
    enum: PaymentMethodEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentPreference?: PaymentMethodEnum;

  @ApiProperty({
    example: DeliveryTimeEnum.AFTERNOON,
    enum: DeliveryTimeEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliveryTimeEnum)
  preferredDeliveryTime?: DeliveryTimeEnum;

  @ApiProperty({ example: 'Peanuts', required: false })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ example: 'African', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
