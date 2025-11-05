import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
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
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'dffdifhweirpwoudroer', required: true })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    example: 'dffdifhweirpwoiufajwiosdfiodifsiroweiudroer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: 'Mozilla-Firefox', required: true })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({ example: '192.166.001.148', required: true })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: '2025-05-01:20:35:00MTZ', required: true })
  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}

export class UpdateUserSessionDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({
    example: 'dffdifhweirpwoiufajwiosdfiodifsiroweiudroer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: '2025-05-01:20:35:00MTZ', required: true })
  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}

export class FilterUserSessionDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'Mozilla-Firefox', required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({ example: '192.166.001.148', required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ example: '2025-05-01:20:35:00MTZ', required: false })
  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}

export class ActiveSessionDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 'dffdifhweirpwoudroer', required: true })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
