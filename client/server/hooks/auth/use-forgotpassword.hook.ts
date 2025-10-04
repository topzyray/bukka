import { AuthApiService } from "@/server/services/AuthApiService";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";

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
