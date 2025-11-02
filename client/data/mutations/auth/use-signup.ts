import { AuthApiService } from "@/data/services/AuthApiService";
import { useCustomMutation } from "@/data/mutations/base";
import { useRouter } from "next/navigation";

export const useSignUp = ({ resetForm }: { resetForm: any }) => {
  const router = useRouter();
  const { mutate: signUpUser, isPending: isSigningUp } = useCustomMutation(
    AuthApiService.signUp,
    {
      onSuccessCallback: () => {
        resetForm();
        setTimeout(() => {
          router.push("/confirm-email");
        }, 3000);
      },
    }
  );
  return {
    signUpUser,
    isSigningUp,
  };
};
