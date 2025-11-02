import { FileCategoryEnum, FileReferenceTypeEnum } from "../enums";

export type CreateMultipleFiles = {
  category: FileCategoryEnum;
  referenceType: FileReferenceTypeEnum;
  referenceId: number;
  fileType?: string;
  fileExtentions?: string;
  isPublic?: boolean;
};

export type DeleteFileDto = {
  relativePath: string;
};
