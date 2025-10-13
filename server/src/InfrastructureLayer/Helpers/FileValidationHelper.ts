import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import sharp from 'sharp';

export class FileValidationHelper {
  // Recommended and hard limits
  private static readonly LIMITS = {
    image: 5 * 1024 * 1024, // 5MB recommended
    pdf: 10 * 1024 * 1024,
    csv: 10 * 1024 * 1024,
    xlsx: 10 * 1024 * 1024,
    video: 100 * 1024 * 1024,
    default: 5 * 1024 * 1024,
  };

  // Hard maximum limits (cannot exceed these)
  private static readonly HARD_LIMITS = {
    image: 15 * 1024 * 1024, // 15MB absolute
    default: 20 * 1024 * 1024, // fallback absolute
  };

  /**
   * Validates and optionally compresses or converts the file.
   * Returns a validated (and possibly modified) file object.
   */
  static async validateAndPrepareFile(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    if (!file || !file.buffer || !file.originalname) {
      throw new BadRequestException('Invalid file or no file attached.');
    }

    const fileType = this.detectFileType(file);
    const recommendedLimit = this.LIMITS[fileType] ?? this.LIMITS.default;
    const hardLimit = this.HARD_LIMITS[fileType] ?? this.HARD_LIMITS.default;

    // ---- Check size against hard limits ----
    if (file.size > hardLimit) {
      const maxMB = (hardLimit / (1024 * 1024)).toFixed(1);
      throw new BadRequestException(
        `File too large. Maximum allowed size for ${fileType.toUpperCase()} is ${maxMB} MB.`,
      );
    }

    // ---- Handle HEIC/HEIF conversion ----
    if (this.isHeicFile(file)) {
      const convertedBuffer = await this.convertToWebp(file.buffer);
      return {
        ...file,
        buffer: convertedBuffer,
        mimetype: 'image/webp',
        originalname: file.originalname.replace(/\.[^/.]+$/, '.webp'),
        size: convertedBuffer.length,
      } as Express.Multer.File;
    }

    // ---- For images: compress if above recommended limit ----
    if (fileType === 'image' && file.size > recommendedLimit) {
      const compressedBuffer = await this.compressImage(
        file.buffer,
        file.mimetype,
      );
      return {
        ...file,
        buffer: compressedBuffer,
        size: compressedBuffer.length,
      } as Express.Multer.File;
    }

    // ---- Validate file type generally ----
    this.validateFileType(file);

    return file;
  }

  // ---- Check allowed MIME types ----
  static validateFileType(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}.`);
    }
  }

  // ---- Detect file type based on extension ----
  private static detectFileType(
    file: Express.Multer.File,
  ): keyof typeof FileValidationHelper.LIMITS {
    const ext = extname(file.originalname).toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext))
      return 'image';
    if (ext === '.pdf') return 'pdf';
    if (['.csv'].includes(ext)) return 'csv';
    if (['.xlsx'].includes(ext)) return 'xlsx';
    if (['.mp4', '.mov', '.avi'].includes(ext)) return 'video';
    return 'default';
  }

  // ---- Compress large images ----
  private static async compressImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<Buffer> {
    const quality = 75;
    const image = sharp(buffer);

    if (mimeType === 'image/png') {
      return image.png({ quality, compressionLevel: 8 }).toBuffer();
    }

    if (mimeType === 'image/webp') {
      return image.webp({ quality }).toBuffer();
    }

    // Default to JPEG for other image types
    return image.jpeg({ quality }).toBuffer();
  }

  // ---- Convert HEIC/HEIF to WebP ----
  private static async convertToWebp(buffer: Buffer): Promise<Buffer> {
    const quality = 80;
    return sharp(buffer).webp({ quality }).toBuffer();
  }

  // ---- Detect if a file is HEIC/HEIF ----
  private static isHeicFile(file: Express.Multer.File): boolean {
    const ext = extname(file.originalname).toLowerCase();
    const isHeicExt = ext === '.heic' || ext === '.heif';
    const isHeicMime =
      file.mimetype === 'image/heic' || file.mimetype === 'image/heif';
    return isHeicExt || isHeicMime;
  }
}
