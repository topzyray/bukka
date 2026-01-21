import { useRouter } from "next/navigation";
import {
  AuthApiService,
  UserApiService,
  FileApiService,
  UserNotificationApiService,
  NotificationSettingApiService,
} from "@/data/services";
import { extractErrorMessage, StorageUtilsHelper } from "@/utils";
import { useCustomMutation } from "@/data/mutations/base";
import { queryClient } from "@/lib";
import { STORE_KEYS } from "@/configs";
import { QueryKeyEnum } from "@/data/enums";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const useSignIn = () => {
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
            toast.error("Failed to persist device ID");
            console.error("Failed to persist device ID", e);
          }
        }

        queryClient.setQueryData([QueryKeyEnum.CURRENT_USER], user);
        useAuthStore.getState().setUser(user);

        await Promise.allSettled([
          queryClient.prefetchQuery({
            queryKey: [QueryKeyEnum.CURRENT_USER],
            queryFn: () => UserApiService.getLoggedInUser(),
          }),
          queryClient.prefetchQuery({
            queryKey: [QueryKeyEnum.USER_FILES],
            queryFn: () => FileApiService.getLoggedInUserFiles(),
          }),
          queryClient.prefetchQuery({
            queryKey: [QueryKeyEnum.NOTIFICATIONS],
            queryFn: () => UserNotificationApiService.getAllMyNotifications(),
          }),
          queryClient.prefetchQuery({
            queryKey: [QueryKeyEnum.NOTIFICATION_SETTING],
            queryFn: () =>
              NotificationSettingApiService.getMyNotificationSetting(),
          }),
        ]);

        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.CURRENT_USER],
        });
      },

      onErrorCallback: (error) => {
        const message = extractErrorMessage(error);
        if (message === "Email verification required!") {
          setTimeout(() => {
            router.push("/confirm-email");
          }, 2000);
        }
      },
    },
  );

  return {
    signInUser,
    isSigningIn,
  };
};
