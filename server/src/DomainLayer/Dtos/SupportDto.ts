import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { PaginationDto } from './Base/PaginationDto';
import { Transform } from 'class-transformer';

export class CreateSupportDto {
  @ApiProperty({ example: 'Tope Taiwo', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@gmail.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Title of the message', required: true })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Description of the message', required: true })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class SupportFilterDto extends PaginationDto {
  @ApiProperty({ example: 'Bruce Willis', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  supportId?: number;

  @ApiProperty({ example: 'INU-1741470230523-6789', required: false })
  @IsOptional()
  @IsString()
  ticketId?: string;

  @ApiProperty({ example: 'Search by name and email', required: false })
  @IsOptional()
  @IsString()
  search: string;
}
