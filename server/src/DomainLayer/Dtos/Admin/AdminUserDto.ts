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
} from 'class-validator';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../Base/PaginationDto';

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
  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId?: number;

  @ApiProperty({
    example: 'Search by email, first name or last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: UserTypeEnum.USER,
    enum: UserTypeEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  userType?: UserTypeEnum;

  @ApiProperty({
    example: UserStatusEnum.ACTIVE,
    enum: UserStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  userStatus?: UserStatusEnum;
}
