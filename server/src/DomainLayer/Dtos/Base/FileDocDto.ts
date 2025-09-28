import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileDocDto {
  @ApiProperty({ example: 'File name' })
  @IsString()
  fileName?: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  fileType?: string;

  @ApiProperty({
    example: 'https://bloburl.other-path.net/container-name',
  })
  @IsString()
  blobUrl?: string;

  @ApiProperty({
    example: '123456/general/image',
  })
  @IsString()
  filePath?: string;

  @ApiProperty({
    example: 'png',
  })
  @IsString()
  fileExtension?: string;
}
