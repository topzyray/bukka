import { AuthApiService } from "@/api/services/AuthApiService";
import { useCustomMutation } from "@/api/queries/use-mutation.hook";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

export const useResetPassword = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    token: string;
    password: string;
    confirm_password: string;
  }>;
}) => {
  const router = useRouter();
  const { mutate: processResetPassword, isPending: isProcessingResetPassword } =
    useCustomMutation(AuthApiService.authResetPassword, {
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
