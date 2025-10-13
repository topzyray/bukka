import { Readable } from 'stream';

export class FileStreamDto {
  filePath: string;
  fileName: string;
  fileType: string;
  buffer: Buffer;
}
