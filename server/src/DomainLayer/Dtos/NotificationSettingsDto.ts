import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SettingsDto } from './Base/SettingsDto';
import { PaginationDto } from './Base/PaginationDto';

export class CreateNotificationSettingsDto {
  // @IsNotEmpty()
  // @IsString()
  // @ApiProperty({ example: "" })
  // // @AutoMap()
  // id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '13244334' })
  userId: number;

  @IsOptional()
  @ApiProperty({ type: SettingsDto })
  settings?: SettingsDto;
}

export class UpdateNotificationSettingsDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsOptional()
  @ApiProperty({ type: SettingsDto })
  settings?: SettingsDto;
}

export class NotificationSettingsFilterDto extends PaginationDto {
  @ApiProperty({ example: '1', required: false })
  userId?: string;
}
