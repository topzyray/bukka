import { useRouter } from "next/navigation";
import {
  AuthApiService,
  UserApiService,
  FileApiService,
  UserNotificationApiService,
  NotificationSettingApiService,
} from "@/server/services";
import { extractErrorMessage, StorageUtilsHelper } from "@/utils";
import { useCustomMutation } from "@/server/mutations/base";
import { useQueryClient } from "@tanstack/react-query";
import { STORE_KEYS } from "@/configs";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: signInUser, isPending: isSigningIn } = useCustomMutation(
    AuthApiService.signIn,
    {
      onSuccessCallback: async (data) => {
        const { user, deviceId } = data?.responseData;

        if (deviceId) {
          try {
            StorageUtilsHelper.saveToLocalStorage([
              STORE_KEYS.DEVICE_ID,
              deviceId,
            ]);
          } catch (e) {
            console.error("Failed to persist device ID", e);
          }
        }

        queryClient.setQueryData(["currentUser"], user);

        await Promise.allSettled([
          queryClient.prefetchQuery({
            queryKey: ["currentUser"],
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

        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
