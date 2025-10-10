import { STORE_KEYS } from "@/configs";
import { RouteHelper } from "../../../helpers";
import { useRouter } from "next/navigation";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import {
  AuthApiService,
  UserApiService,
  FileApiService,
  UserNotificationApiService,
  NotificationSettingApiService,
} from "@/server/services";
import { extractErrorMessage } from "@/utils";
import { useCustomMutation } from "@/server/mutations/base";
import { useQueryClient } from "@tanstack/react-query";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: signInUser, isPending: isSigningIn } = useCustomMutation(
    AuthApiService.signIn,
    {
      onSuccessCallback: async (data) => {
        const { accessToken, refreshToken, user } = data?.responseData;
        StorageUtilsHelper.saveToLocalStorage(
          [STORE_KEYS.USER_ACCESS_TOKEN, accessToken],
          [STORE_KEYS.USER_REFRESH_TOKEN, refreshToken]
        );

        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: () => UserApiService.getLoggedInUser(),
          }),
          queryClient.prefetchQuery({
            queryKey: ["userFiles"],
            queryFn: () => FileApiService.getLoggedInUserFiles(),
          }),
          queryClient.prefetchQuery({
            queryKey: ["notifications"],
            queryFn: () => UserNotificationApiService.getAllMyNotifications(),
          }),
          queryClient.prefetchQuery({
            queryKey: ["notification-setting"],
            queryFn: () =>
              NotificationSettingApiService.getMyNotificationSetting(),
          }),
        ]);

        router.push(RouteHelper.getDashboardPath(user));
      },

      onErrorCallback: (error) => {
        const message = extractErrorMessage(error);
        if (message === "Email verification required!") {
          setTimeout(() => {
            router.push("/confirm-email");
          }, 2000);
        }
      },
    }
  );

  return {
    signInUser,
    isSigningIn,
  };
};
