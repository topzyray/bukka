import { File } from "../interfaces/File";
import { FileReferenceTypeEnum, QueryKeyEnum } from "../enums";
import { BukkaResponse, useCustomQuery } from "./base";
import { FileApiService } from "@/data/services/FileApiService";

export const useBusinessFiles = ({ businessId }: { businessId: number }) => {
  return useCustomQuery<BukkaResponse<File[]>>(
    [QueryKeyEnum.BUSINESS_FILES, businessId],
    () =>
      FileApiService.getByReferenceIdAndType({
        referenceType: FileReferenceTypeEnum.BUSINESS,
        referenceId: businessId,
      }),
    {
      enabled: !!businessId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
