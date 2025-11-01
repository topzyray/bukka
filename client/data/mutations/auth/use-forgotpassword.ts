import { useCustomMutation } from "@/data/mutations/base";
import { AuthApiService } from "@/data/services";

export const useForgotPassword = () => {
  const { mutate: submitForgotPassord, isPending: submitingRequest } =
    useCustomMutation(AuthApiService.forgotPassword, {
      onSuccessCallback: (data) => {
        // push("/reset-password");
      },
    });

  return {
    submitForgotPassord,
    submitingRequest,
  };
};
