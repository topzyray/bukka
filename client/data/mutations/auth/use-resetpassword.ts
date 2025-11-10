import { AuthApiService } from "@/data/services";
import { useCustomMutation } from "@/data/mutations/base";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

export const useResetPassword = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    token: string;
    newPassword: string;
  }>;
}) => {
  const router = useRouter();
  const { mutate: processResetPassword, isPending: isProcessingResetPassword } =
    useCustomMutation(AuthApiService.resetPassword, {
      onSuccessCallback: () => {
        resetForm();
        router.push("/signin");
      },
    });

  return {
    processResetPassword,
    isProcessingResetPassword,
  };
};
