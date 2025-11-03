import { FileApiService } from "@/data/services/FileApiService";
import { useCustomQuery } from "./base";

export const useUserFiles = ({ userId }: { userId?: number }) => {
  return useCustomQuery(
    ["user-files", userId],
    () => FileApiService.getLoggedInUserFiles(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
