import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { AuthApiService } from "@/server/services/AuthApiService";

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
