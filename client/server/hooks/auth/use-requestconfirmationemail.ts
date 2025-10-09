import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { AuthApiService } from "@/server/services/AuthApiService";
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
