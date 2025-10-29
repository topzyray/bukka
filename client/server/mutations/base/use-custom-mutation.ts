import { TextHelper } from "@/helpers/text-helper";
import { extractErrorMessage } from "@/utils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCustomMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  onSuccessMessage?: string;
  onErrorMessage?: string;
  onSuccessCallback?: (data: TData) => void;
  onErrorCallback?: (error: TError) => void;
  toastStatusMessage?: boolean;
}

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (params: TVariables) => Promise<TData>,
  options: UseCustomMutationOptions<TData, TError, TVariables, TContext> = {}
) => {
  const {
    onSuccessMessage,
    onErrorMessage,
    onSuccessCallback,
    onErrorCallback,
    toastStatusMessage = true,
    onSuccess,
    onError,
    ...restOptions
  } = options;

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context, mutation) => {
      if (toastStatusMessage) {
        toast.success(
          onSuccessMessage ??
            TextHelper.capitalize((data as any)?.responseMessage) ??
            "Operation successful"
        );
      }

      onSuccessCallback?.(data);
      onSuccess?.(data, variables, context, mutation);
    },
    onError: (error, variables, context, mutation) => {
      if (toastStatusMessage) {
        toast.error(
          onErrorMessage ??
            TextHelper.capitalize(extractErrorMessage(error as any)) ??
            "Something went wrong"
        );
      }

      onErrorCallback?.(error);
      onError?.(error, variables, context, mutation);
    },
    ...restOptions,
  });

  return mutation;
};
