import { BusinessTypeEnum } from "../enums/BusinessTypeEnum";

export interface CreateCategoryDto {
  name: string;
  type: BusinessTypeEnum;
  description?: string;
  iconUrl?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  type?: BusinessTypeEnum;
  description?: string;
  iconUrl?: string;
}
