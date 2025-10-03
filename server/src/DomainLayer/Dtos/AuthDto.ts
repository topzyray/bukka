import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserDto } from './UserDto';
import { UserResponse } from '../Models/UserResponse';

export class SigninDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ad123456@', required: true })
  @IsNotEmpty()
  password: string;
}

export class ConfirmEmailDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '000000', required: true })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ResendConfirmEmailDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '000000', required: true })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'Ad123456@', required: true })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 12, required: true })
  @IsNotEmpty()
  @IsString()
  userId: number;

  @ApiProperty({ example: '********', required: true })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: '********', required: true })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'data', required: true })
  @IsNotEmpty()
  @IsString()
  oldRefreshToken: string;
}

export class LoginResponseDto {
  user: UserResponse;
  counts: {
    favorites: number;
  };
  accessToken: string;
  refreshToken: string;
}
