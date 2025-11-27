import { BukkaResponse, useCustomQuery } from "./base";
import { UserPersonalizationApiService } from "../services";
import { UserPersonalization } from "../interfaces/UserPersonalization";
import { QueryKeyEnum } from "../enums";

export const useUserPersonalization = ({ userId }: { userId?: number }) => {
  return useCustomQuery<BukkaResponse<UserPersonalization>>(
    [QueryKeyEnum.USER_PERSONALIZATION, userId],
    () => UserPersonalizationApiService.getLoggedUserPersonalization(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
