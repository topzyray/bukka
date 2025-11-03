import { BukkaResponse, useCustomQuery } from "./base";
import { UserPersonalizationApiService } from "../services";
import { UserPersonalization } from "../interfaces/UserPersonalization";

export const useUserPersonalization = ({ userId }: { userId?: number }) => {
  return useCustomQuery<BukkaResponse<UserPersonalization>>(
    ["user-personalization", userId],
    () => UserPersonalizationApiService.getLoggedUserPersonalization(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
