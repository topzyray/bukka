import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserSessionDto {
  id: number;
  userId: number;
  deviceId: string;
  refreshToken: String;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserSessionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'dffdifhweirpwoudroer' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ example: 'dffdifhweirpwoiufajwiosdfiodifsiroweiudroer' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: 'Mozilla-Firefox' })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({ example: '192.166.001.148' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}

export class UpdateUserSessionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'dffdifhweirpwoiufajwiosdfiodifsiroweiudroer' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}
