import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from './Base/PaginationDto';

export class ProcessExceptionLogDto {
  logId?: string;
  userId: string;
  exceptionDate: string;
  method?: string;
  url?: string;
  status?: number;
  details: any;
}

export class ExceptionLogFilterDto extends PaginationDto {
  @ApiProperty({ example: '1233455', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
