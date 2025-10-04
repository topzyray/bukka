import { AuthApiService } from "@/api/services/AuthApiService";
import { useCustomMutation } from "@/api/queries/use-mutation.hook";

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
