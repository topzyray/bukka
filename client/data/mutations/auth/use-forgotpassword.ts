import { useCustomMutation } from "@/data/mutations/base";
import { AuthApiService } from "@/data/services";
import { useRouter } from "next/navigation";

export const useForgotPassword = () => {
  const router = useRouter();
  const { mutate: submitForgotPassord, isPending: submitingRequest } =
    useCustomMutation(AuthApiService.forgotPassword, {
      onSuccessCallback: () => {
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      },
    });

  return {
    submitForgotPassord,
    submitingRequest,
  };
};
