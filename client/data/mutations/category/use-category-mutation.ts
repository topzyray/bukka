import { QueryKeyEnum } from "@/data/enums";
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
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
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
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
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
      queryClient.removeQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES],
      });
      queryClient.removeQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CATEGORIES_INFINITE],
      });
      queryClient.removeQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      onSuccess?.();
    },
  });
};
