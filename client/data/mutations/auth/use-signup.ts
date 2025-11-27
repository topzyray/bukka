import { AuthApiService } from "@/data/services/AuthApiService";
import { useCustomMutation } from "@/data/mutations/base";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/data/enums";

export const useSignUp = ({ resetForm }: { resetForm: any }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signUpUser, isPending: isSigningUp } = useCustomMutation(
    AuthApiService.signUp,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
        });
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
