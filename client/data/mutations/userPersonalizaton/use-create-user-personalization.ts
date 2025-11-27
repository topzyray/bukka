import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserPersonalizationApiService } from "@/data/services/UserPersonalizationApiService";
import { QueryKeyEnum } from "@/data/enums";

export const useCreateUserPersonalization = ({
  onSuccess,
  userId,
}: {
  onSuccess: () => void;
  userId?: number;
}) => {
  const queryClient = useQueryClient();
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
        onSuccess?.();
      },
    }
  );
};
