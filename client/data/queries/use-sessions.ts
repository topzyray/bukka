import { BukkaResponse, useCustomQuery } from "./base";
import { UserSessionApiService } from "../services/UserSessionApiService";
import { UserSession } from "../interfaces/UserSession";
import { QueryKeyEnum } from "../enums";

export const useUserSessions = ({ userId }: { userId: number }) => {
  return useCustomQuery<BukkaResponse<UserSession[]>>(
    [QueryKeyEnum.USER_SESSIONS],
    () => UserSessionApiService.getLoggedUserSession(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }
  );
};

export const useUserActionSessions = ({
  query,
}: {
  query: {
    userId: number;
    deviceId: string;
  };
}) => {
  return useCustomQuery<BukkaResponse<UserSession>>(
    [QueryKeyEnum.USER_ACTIVE_SESSIONS],
    () => UserSessionApiService.getUserActiveSession(query),
    {
      enabled: !!query.userId && !!query.deviceId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
