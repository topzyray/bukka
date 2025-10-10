import { useCustomMutation } from "@/server/mutations/base";
import { AuthApiService } from "@/server/services";

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
