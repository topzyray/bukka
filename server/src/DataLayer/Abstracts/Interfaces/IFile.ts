import { FileCategoryEnum } from 'src/DomainLayer/Enums/FileCategoryEnum';
import { FileReferenceTypeEnum } from 'src/DomainLayer/Enums/FileReferenceTypeEnum';

export interface IFile {
  fileName: string;
  fileType: string;
  fileExtension: string;
  relativePath: string;
  fullPath: string;
  category: FileCategoryEnum;
  referenceType: FileReferenceTypeEnum;
  referenceId: number;
  createdById?: number;
  fileSize?: number;
  mimeType?: string;
  isPublic?: boolean;
  metadata?: any;
}
