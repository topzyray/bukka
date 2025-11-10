import { File } from "../interfaces/File";
import { FileReferenceTypeEnum } from "../enums";
import { BukkaResponse, useCustomQuery } from "./base";
import { FileApiService } from "@/data/services/FileApiService";

export const useBusinessFiles = ({ businessId }: { businessId: number }) => {
  return useCustomQuery<BukkaResponse<File[]>>(
    ["business-files", businessId],
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
