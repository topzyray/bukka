import { AuthApiService } from "@/server/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { toast } from "sonner";

export const useSignUp = () => {
  const { mutate: signUpUser, isPending: isSigningUp } = useCustomMutation(
    AuthApiService.signUp,
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
