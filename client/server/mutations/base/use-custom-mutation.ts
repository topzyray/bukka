import { TextHelper } from "@/helpers/text-helper";
import { extractErrorMessage } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCustomMutationOptions {
  onSuccessMessage?: string;
  onErrorMessage?: string;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
  toastStatusMessage?: boolean;
  retry?: number;
  retryDelay?: number;
}

export const useCustomMutation = <T, P>(
  mutationFn: (params: P) => Promise<T>,
  options: UseCustomMutationOptions = {}
) => {
  const {
    onSuccessMessage,
    onErrorMessage,
    onSuccessCallback,
    onErrorCallback,
    toastStatusMessage = true,
    retry,
    retryDelay,
  } = options;

  const mutation = useMutation<T, Error, P>({
    mutationFn,
    onSuccess: (data: any) => {
      if (toastStatusMessage) {
        if (onSuccessMessage) {
          toast.success(onSuccessMessage);
        } else {
          toast.success(
            TextHelper.capitalize(data?.responseMessage) ||
              "Operation successful"
          );
        }
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error) => {
      if (toastStatusMessage) {
        if (onErrorMessage) {
          toast.error(onErrorMessage);
        } else {
          toast.error(
            TextHelper.capitalize(extractErrorMessage(error)) ||
              "Something went wrong"
          );
        }
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
    retry,
    retryDelay,
  });

  return mutation;
};
