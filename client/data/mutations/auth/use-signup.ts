import { AuthApiService } from "@/data/services/AuthApiService";
import { useCustomMutation } from "@/data/mutations/base";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const useSignUp = ({ resetForm }: { resetForm: any }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signUpUser, isPending: isSigningUp } = useCustomMutation(
    AuthApiService.signUp,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
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
