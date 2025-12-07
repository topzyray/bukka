import { PlaceProviderEnum } from "../enums/PlaceProviderEnum";

export interface PlaceImportDto {
  provider: PlaceProviderEnum;
  externalId: string;
  categoryId: number;
  recommendedByUserId: number;
  importMode?: "create" | "update";
}
