import { FileApiService } from "@/server/services/FileApiService";
import { useCustomQuery } from "./base";
import { FileReferenceTypeEnum } from "../enums";

export const useBusinessFiles = ({ businessId }: { businessId: number }) => {
  return useCustomQuery(
    ["businessFiles", businessId],
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
