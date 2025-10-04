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

export class WaitlistDto {
  id: number;
  name: string;
  email: string;
  location: string;
  cuisine: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateWaitlistDto {
  @ApiProperty({ example: 'Akingbade' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'example@bukka.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
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

  @ApiProperty({ example: '+447' })
  @IsString()
  @IsOptional()
  phoneCountryCode?: string;

  @ApiProperty({ example: 'This is about me', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
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
