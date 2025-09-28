import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty({ example: true })
  isEmailTurnedOn?: boolean = true;

  @ApiProperty({ example: true })
  isInAppTurnedOn?: boolean = true;

  @ApiProperty({ example: true })
  isPushTurnedOn?: boolean = true;
}
