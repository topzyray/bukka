import { AuthApiService } from "@/api/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/api/queries/use-mutation.hook";
import { toast } from "sonner";

export const useForgotPassword = () => {
  const { mutate: submitForgotPassord, isPending: submitingRequest } =
    useCustomMutation(AuthApiService.authForgotPassword, {
      onSuccessCallback: (data) => {
        console.log("FORGOT PASSWORD DATA: ", data);
      },

      onErrorCallback: (error) => {
        console.log("ERROR SENDING REQUEST UP USER: ", error);
        toast.error(extractErrorMessage(error));
      },
    });

  return {
    submitForgotPassord,
    submitingRequest,
  };
};
