import { useCustomMutation } from "@/server/mutations/base";
import { BusinessApiService } from "@/server/services/BusinessApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateBusiness = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessApiService.createBusiness, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["businesses"] });
      resetForm();
      onSuccess?.();
    },
  });
};

export const useUpdateBusiness = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    ({ id, payload }: { id: number; payload: any }) =>
      BusinessApiService.updateBusiness(id, payload),
    {
      onSuccessCallback: async () => {
        await queryClient.invalidateQueries({ queryKey: ["businesses"] });
        resetForm();
        onSuccess?.();
      },
    }
  );
};

export const useDeleteBusiness = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessApiService.deleteBusiness, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["businesses"] });
      onSuccess?.();
    },
  });
};
