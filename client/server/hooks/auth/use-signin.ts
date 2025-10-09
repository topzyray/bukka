import { STORE_KEYS } from "@/configs/store.config";
import { RouteHelper } from "../../../helpers/RouteHelper";
import { useRouter } from "next/navigation";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { AuthApiService } from "@/server/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { useAuth } from "@/providers/auth-provider";

export const useSignIn = () => {
  const router = useRouter();
  const { saveUserDetails } = useAuth();

  const { mutate: signInUser, isPending: isSigningIn } = useCustomMutation(
    AuthApiService.signIn,
    {
      onSuccessCallback: (data) => {
        const { accessToken, refreshToken, user } = data?.responseData;
        StorageUtilsHelper.saveToLocalStorage(
          [STORE_KEYS.USER_ACCESS_TOKEN, accessToken],
          [STORE_KEYS.USER_REFRESH_TOKEN, refreshToken],
          [STORE_KEYS.USER_DETAILS, user]
        );
        saveUserDetails(user);
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
