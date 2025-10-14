import imageCompression from "browser-image-compression";
import { toast } from "sonner";

export class FileHelper {
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  static readonly MAX_DIMENSION = 512; // max width/height
  static async compressImage(
    file: File,
    maxFileSize: number = this.MAX_FILE_SIZE,
    maxDimension: number = this.MAX_DIMENSION
  ): Promise<File | null> {
    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: maxDimension,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > maxFileSize) {
        toast.error("Image is still too large. Please choose a smaller one.");
        return null;
      }
      return compressedFile;
    } catch (err) {
      console.error("Image compression failed:", err);
      toast.error("Failed to compress image. Please try again.");
      return null;
    }
  }

  static async validateFile(files: File[]): Promise<File[] | []> {
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast(`Invalid file type: ${file.name}`);
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE) {
        const compressed = await this.compressImage(file);
        if (compressed) validFiles.push(compressed);
      } else {
        validFiles.push(file);
      }
    }
    return validFiles;
  }
}
