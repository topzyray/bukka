import { useCustomMutation } from "@/data/mutations/base";
import { AuthApiService } from "@/data/services";
import { useRouter } from "next/navigation";

export const useRequestConfirmationEmail = () => {
  const router = useRouter();

  const { mutate: submitRequest, isPending: submitingRequest } =
    useCustomMutation(AuthApiService.resendConfirmationEmail, {
      onSuccessCallback: () => {
        setTimeout(() => {
          router.push("/confirm-email");
        }, 2000);
      },
    });

  return {
    submitRequest,
    submitingRequest,
  };
};
