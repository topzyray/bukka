import { RouteHelper } from "../../../helpers/RouteHelper";
import { useRouter } from "next/navigation";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { AuthApiService } from "@/api/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/api/queries/use-mutation.hook";

export const useSignIn = () => {
  const router = useRouter();

  const { mutate: signInUser, isPending: isSigningIn } = useCustomMutation(
    AuthApiService.signIn,
    {
      onSuccessCallback: (data) => {
        const { accessToken, refreshToken, user } = data;

        StorageUtilsHelper.saveToLocalStorage(
          [STORE_KEYS.USER_ACCESS_TOKEN, accessToken],
          [STORE_KEYS.USER_REFRESH_TOKEN, refreshToken],
          [STORE_KEYS.USER_DETAILS, user]
        );
        router.push(RouteHelper.getDashboardPath(user));
      },

      onErrorCallback: (error) => {
        const message = extractErrorMessage(error);
        if (
          message ===
          "Please verify your email with the token sent to your email address..."
        ) {
          setTimeout(() => {
            router.push("/email-verification");
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
