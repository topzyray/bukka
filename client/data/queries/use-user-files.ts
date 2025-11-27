import { FileApiService } from "@/data/services/FileApiService";
import { useCustomQuery } from "./base";
import { QueryKeyEnum } from "../enums";

export const useUserFiles = ({ userId }: { userId?: number }) => {
  return useCustomQuery(
    [QueryKeyEnum.USER_FILES, userId],
    () => FileApiService.getLoggedInUserFiles(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
