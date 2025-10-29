export interface File {
  id?: number;
  referenceId?: number;
  category: string;
  fileName: string;
  fileType: string;
  fullPath: string;
  fileExtension: string;
  relativePath: string;
  referenceType: string;
  createdById?: number;
  fileSize?: number;
  mimeType?: string;
  isPublic: boolean;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
