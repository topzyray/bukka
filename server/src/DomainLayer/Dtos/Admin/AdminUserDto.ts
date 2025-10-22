import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { UserStatusEnum } from '../../Enums/UserStatusEnum';
import { UserTypeEnum } from '../../Enums/UserTypeEnum';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../Base/PaginationDto';
import { GenderEnum } from 'src/DomainLayer/Enums/GenderEnum';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'example@bukka.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ad123456@' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ValidationHelper.IsPasswordStrong({
    message:
      'Password is not strong enough. Password must contain at least one letter and one symbol.',
  })
  password: string;

  @ApiProperty({ example: 'Akingbade' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Chukuemeka' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: UserRoleEnum.ADMIN, required: true })
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  emailConfirmed?: boolean;

  @IsString()
  @IsOptional()
  confirmationCode?: string;

  @IsDateString()
  @IsOptional()
  confirmationCodeExpires?: Date;

  @IsString()
  @IsOptional()
  passwordResetToken: string;

  @IsDateString()
  @IsOptional()
  passwordResetExpires: Date;

  @IsString()
  @IsOptional()
  userStatus?: string;
}

export class AdminUpdateUserDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  id: number;

  @ApiProperty({
    example: UserStatusEnum.DEACTIVATED,
    enum: UserStatusEnum,
    required: false,
  })
  @IsString()
  userStatus?: string;

  @ApiProperty({ example: UserTypeEnum.USER })
  userType?: string;
}

export class AdminUserFilterDto extends PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId?: number;

  @ApiProperty({
    example: UserRoleEnum.USER,
    enum: UserRoleEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: UserRoleEnum;

  @ApiProperty({
    example: UserStatusEnum.ACTIVE,
    enum: UserStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  userStatus?: UserStatusEnum;

  @ApiProperty({
    example: GenderEnum.MALE,
    enum: GenderEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: GenderEnum;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isDeleted?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isOnboarded?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  emailConfirmed?: boolean;

  @ApiProperty({
    example: 'Search by username, email, first name or last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
