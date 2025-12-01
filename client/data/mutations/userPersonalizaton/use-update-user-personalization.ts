import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserPersonalizationApiService } from "@/data/services/UserPersonalizationApiService";
import { QueryKeyEnum } from "@/data/enums";

export const useUpdateUserPersonalization = ({
  onSuccess,
  userId,
}: {
  onSuccess: () => void;
  userId?: number;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    UserPersonalizationApiService.updateLoggedUserPersonalization,
    {
      onSuccessCallback() {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.USER_PERSONALIZATION, userId],
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
    }
  );
};
