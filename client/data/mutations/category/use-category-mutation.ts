import { useCustomMutation } from "@/data/mutations/base";
import { BusinessCategoryApiService } from "@/data/services/BusinessCategoryApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateCategory = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useCustomMutation(BusinessCategoryApiService.createCategory, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-overview"],
      });
      resetForm();
      onSuccess?.();
    },
  });
};

export const useUpdateCategory = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessCategoryApiService.updateCategory, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-overview"],
      });
      onSuccess?.();
    },
  });
};

export const useDeleteCategory = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessCategoryApiService.deleteCategory, {
    onSuccessCallback: async () => {
      queryClient.removeQueries({ queryKey: ["business-categories"] });
      onSuccess?.();
    },
  });
};
