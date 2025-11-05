import { BukkaResponse, useCustomQuery } from "./base";
import { UserSessionApiService } from "../services/UserSessionApiService";
import { UserSession } from "../interfaces/UserSession";

export const useUserSessions = ({ userId }: { userId: number }) => {
  return useCustomQuery<BukkaResponse<UserSession[]>>(
    ["user-sessions"],
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
    ["user-active-session"],
    () => UserSessionApiService.getUserActiveSession(query),
    {
      enabled: !!query.userId && !!query.deviceId,
      staleTime: 1000 * 60 * 10,
    }
  );
};
