import { Readable } from 'stream';
import * as fs from 'fs';
import path from 'path';
import { FileMimeTypeEnum } from 'src/DomainLayer/Enums/FileMimeTypeEnum';

export class FileHelper {
  static getFileExtension = (file: Express.Multer.File): string | null => {
    const fileName = file.originalname;
    if (!fileName) {
      return null;
    }

    const ext = fileName.split('.').pop();
    return ext ? ext.toLowerCase() : null;
  };

  static streamToBuffer(stream: any) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk as never));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error) => reject(error));
    });
  }

  static async binaryStringToStream(binaryString: string): Promise<Readable> {
    const stream = new Readable();
    stream._read = () => null;

    stream.push(Buffer.from(binaryString, 'binary'));
    stream.push(null);

    return stream;
  }

  static async storeBinaryStreamAsFile(
    binaryStream: Buffer,
    filePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath, 'binary');

      writeStream.write(binaryStream, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          writeStream.end();
          resolve();
        }
      });

      writeStream.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  static async getHtmlTemplate(fileName: string) {
    return this.getFilePath('Templates', `${fileName}.html`);
  }

  static async getFilePath(filePath: string, fileName: string) {
    const templatePath = path.resolve(
      'src',
      `UtilityLayer/Views/${filePath}/${fileName}`,
    );
    return templatePath;
  }

  static checkFileType(
    file: Express.Multer.File,
    mimeType: FileMimeTypeEnum,
    suffix: string,
  ) {
    return file.mimetype == mimeType || file.originalname.endsWith(suffix);
  }

  static generateUniqueFileName() {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomSuffix}`;
  }
}
