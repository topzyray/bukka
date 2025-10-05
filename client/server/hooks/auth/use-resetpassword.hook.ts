import { AuthApiService } from "@/server/services/AuthApiService";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

export const useResetPassword = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    token: string;
    email: string;
    newPassword: string;
  }>;
}) => {
  const router = useRouter();
  const { mutate: processResetPassword, isPending: isProcessingResetPassword } =
    useCustomMutation(AuthApiService.resetPassword, {
      onSuccessCallback: () => {
        resetForm();
        router.push("/login");
      },
    });

  return {
    processResetPassword,
    isProcessingResetPassword,
  };
};
