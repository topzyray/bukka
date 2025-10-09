import { AuthApiService } from "@/server/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

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
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
        resetForm();
      },
      onErrorCallback: (error) => {
        if (
          extractErrorMessage(error) ===
          "Token does not exist or verification token has expired. You can request for another one"
        ) {
          setTimeout(() => {
            router.push("/request-email-verification");
          }, 2000);
        }
      },
    });

  return {
    verifyNewUser,
    isVerifyingUser,
  };
};
