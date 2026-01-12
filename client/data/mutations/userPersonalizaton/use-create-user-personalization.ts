import { useCustomMutation } from "../base";
import { queryClient } from "@/lib";
import { UserPersonalizationApiService } from "@/data/services/UserPersonalizationApiService";
import { QueryKeyEnum } from "@/data/enums";

export const useCreateUserPersonalization = ({
  onSuccess,
  userId,
}: {
  onSuccess: () => void;
  userId?: number;
}) => {
  return useCustomMutation(
    UserPersonalizationApiService.createUserPersonalization,
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
