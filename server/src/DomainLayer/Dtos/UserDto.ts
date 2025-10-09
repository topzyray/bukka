import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import { UserStatusEnum } from '../Enums/UserStatusEnum';
import { PaginationDto } from './Base/PaginationDto';
import { GenderEnum } from '../Enums/GenderEnum';
import { Transform } from 'class-transformer';
import { UserRoleEnum } from '../Enums/UserRoleEnum';
import { UserNotification } from '../Models/UserNotification';
import { UserTypeEnum } from '../Enums/UserTypeEnum';
import { Favorite } from '../Models/Favorite';

export class UserDto {
  id: number;
  email: string;
  password: string;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
  username: string;
  gender: GenderEnum;
  onboardingProgress: number;
  confirmationCodeExpires: Date;
  phoneNumber: string;
  phoneCountryCode: string;
  phoneNumberConfirmed: boolean;
  bio?: string;
  locationId: number;
  location: Location;
  userStatus: string;
  emailConfirmed: boolean;
  refreshToken: string;
  lastLoginAt: Date;
  isDeleted: boolean;
  isUpdated: boolean;
  deletedAt: Date;
  favorites: Favorite[];
  userNotifications: UserNotification[];
  createdAt: Date;
  updatedAt: Date;
  counts: {
    favorites: number;
  };
}

export class CreateUserDto {
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

  @ApiProperty({ example: 'USER' })
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
  refreshToken?: string;

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

export class UpdateUserDto {
  @ApiProperty({ example: 'topzyray' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'Oluwasina' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Taiwo' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '7001234445', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'This is about me', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  onboardingProgress: number;
}

export class ProfileUpdateDto {
  @ApiProperty({ example: '7901234445', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '+447', required: false })
  @IsString()
  @IsOptional()
  phoneCountryCode?: string;

  @ApiProperty({ example: 'topzyray', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ example: 'This is about me', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class UserFilterDto extends PaginationDto {
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

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;
}
