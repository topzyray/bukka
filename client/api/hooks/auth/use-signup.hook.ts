import { AuthApiService } from "@/api/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/api/queries/use-mutation.hook";
import { toast } from "sonner";

export const useSignUp = () => {
  const { mutate: signUpUser, isPending: isSigningUp } = useCustomMutation(
    AuthApiService.authRegister,
    {
      onSuccessCallback: (data) => {
        console.log("SIGN UP DATA: ", data);
      },

      onErrorCallback: (error) => {
        console.log("ERROR SIGNING UP USER: ", error);
        toast.error(extractErrorMessage(error));
      },
    }
  );

  return {
    signUpUser,
    isSigningUp,
  };
};
