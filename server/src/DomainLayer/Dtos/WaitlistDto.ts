import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';

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
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'example@bukka.com' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '+2347035527946' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class WaitlistFilterDto extends PaginationDto {
  @ApiProperty({ example: 'example@bukka.com', required: false })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @ApiProperty({ example: '+2347035527946', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'Search with name or email', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
