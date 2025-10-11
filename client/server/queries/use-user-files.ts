import { FileApiService } from "@/server/services/FileApiService";
import { useCustomQuery } from "./base";

export const useUserFiles = (userId?: number) => {
  return useCustomQuery(
    ["userFiles", userId],
    () => FileApiService.getLoggedInUserFiles(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
