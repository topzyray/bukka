import { ApiProperty } from '@nestjs/swagger';
import { NotificationTypeEnum } from '../Enums/NotificationTypeEnum';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';

export class UserNotificationDto {
  @ApiProperty({ example: 1, required: true })
  @IsString()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 'Welcome to Bukka', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: "You're welcome to Bukka", required: true })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    example: NotificationTypeEnum.EMAIL,
    enum: NotificationTypeEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  notificationType: NotificationTypeEnum;

  @IsOptional()
  references?: any;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isRead: boolean;

  @ApiProperty({
    example: '🆕',
  })
  @IsString()
  @IsOptional()
  icon?: string;
}

export class CreateNotificationDto {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Required if businessId is not provided',
  })
  @IsNumber()
  @ValidateIf((o) => !o.businessId)
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'Welcome to Bukka', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: "You're welcome to Bukka", required: true })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    example: 'https://www.google.com',
    required: false,
  })
  @IsString()
  link?: string;

  @ApiProperty({
    example: 'NEW USER SIGNUP',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  notificationCategory: string;

  @ApiProperty({
    example: '🆕',
    required: false,
    default: '🆕',
  })
  @IsString()
  icon?: string;
}

export class UpdateNotificationDto {
  @ApiProperty({ example: 'Welcome to Bukka', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: "You're welcome to Bukka", required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    example: NotificationTypeEnum.EMAIL,
    enum: NotificationTypeEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  notificationType?: NotificationTypeEnum;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isRead?: boolean;

  @ApiProperty({
    example: '🆕',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @IsOptional()
  references?: any;
}

export class UserNotificationFilterDto extends PaginationDto {
  @ApiProperty({
    example: 'SIGN_UP',
    required: false,
  })
  @IsString()
  @IsOptional()
  notificationCategory?: string;

  // @ApiProperty({
  //   example: '1',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // businessId?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isRead?: boolean;

  @ApiProperty({
    example: 'welcome',
    required: false,
    description: 'Search in title and message fields',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
