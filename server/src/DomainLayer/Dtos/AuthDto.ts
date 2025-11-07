import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserResponse } from '../Models/UserResponse';

export class SigninDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: 'Ad123456@', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SigninMetaDataDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({ example: 'Chrome', required: true })
  @IsNotEmpty()
  @IsString()
  userAgent: string;
}

export class ConfirmEmailDto {
  // @ApiProperty({ example: 'example@bukka.com', required: true })
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  @ApiProperty({ example: '000000', required: true })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ResendConfirmEmailDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@bukka.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  // @ApiProperty({ example: 'example@bukka.com', required: true })
  // @IsNotEmpty()
  // @IsEmail()
  // @Transform(({ value }) => value?.trim().toLowerCase())
  // email: string;

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
  @ApiProperty({ example: 'token_data', required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class LoginResponseDto<T> {
  user: T;
  accessToken: string;
  refreshToken: string;
  deviceId: string;
}

export class RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
}
