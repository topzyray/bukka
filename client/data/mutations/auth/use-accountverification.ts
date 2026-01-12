import { AuthApiService } from "@/data/services";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";
import { extractErrorMessage } from "@/utils";
import { useCustomMutation } from "../base";
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "@/data/enums";

export const useAccountVerification = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    token: string;
  }>;
}) => {
  const router = useRouter();
  const { mutate: verifyNewUser, isPending: isVerifyingUser } =
    useCustomMutation(AuthApiService.confirmEmail, {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
        });
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
        resetForm();
      },
      onErrorCallback: (error) => {
        if (
          extractErrorMessage(error) ===
          "Token does not exist or verification token has expired. You can request for another one"
        ) {
          setTimeout(() => {
            router.push("/request-email-verification");
          }, 3000);
        }
      },
    });

  return {
    verifyNewUser,
    isVerifyingUser,
  };
};
