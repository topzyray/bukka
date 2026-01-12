import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "@/data/mutations/base";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { PlaceAdminApiService } from "@/data/services/PlaceAdminApiService";
import { queryClient } from "@/lib";

export const useCreateBusiness = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  return useCustomMutation(BusinessApiService.createBusiness, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
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

export const useImportBusiness = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useCustomMutation(PlaceAdminApiService.importOne, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
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
  return useCustomMutation(
    ({ id, payload }: { id: number; payload: any }) =>
      BusinessApiService.updateBusiness(id, payload),
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.BUSINESSES],
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
    }
  );
};

export const useAddFeaturedBusiness = ({
  resetForm,
  onSuccess,
  onError,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useCustomMutation(
    ({ id, payload }: { id: number; payload: any }) =>
      BusinessApiService.setBusinessAsFeatured(id, payload),
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.BUSINESSES],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.BUSINESSES_INFINITE],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.FEATURED_BUSINESSES],
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
      onErrorCallback: (error) => {
        onError?.(error);
      },
    }
  );
};

export const useDeleteBusiness = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useCustomMutation(BusinessApiService.deleteBusiness, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
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
      onSuccess?.();
    },
  });
};
