import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserPersonalizationApiService } from "@/data/services/UserPersonalizationApiService";

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
          queryKey: ["user-personalization", userId],
        });
        onSuccess?.();
      },
    }
  );
};
