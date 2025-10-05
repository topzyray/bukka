import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';

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

  @ApiProperty({ example: '+2347035527946' })
  @IsString()
  phoneNumber: string;
}

export class WaitlistFilterDto extends PaginationDto {
  @ApiProperty({ example: 'example@bukka.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+2347035527946' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
