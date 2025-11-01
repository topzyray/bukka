import { UpdateCategoryDto } from "@/data/dtos";
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
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-categories"],
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
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-categories"],
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
