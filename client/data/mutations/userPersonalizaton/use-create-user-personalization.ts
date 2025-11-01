import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserPersonalizationApiService } from "@/data/services/UserPersonalizationApiService";

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
          queryKey: ["user-personalization", userId],
        });
        onSuccess?.();
      },
    }
  );
};
