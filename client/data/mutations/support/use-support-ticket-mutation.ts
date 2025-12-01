import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "../base";
import { SupportApiService } from "@/data/services";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(SupportApiService.createTicket, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORT],
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

export const useAssignTicketToTeam = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(SupportApiService.assignTicket, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORT],
      });
      onSuccess?.();
    },
  });
};

export const useResolveTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(SupportApiService.resolveTicket, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORT],
      });
      onSuccess?.();
    },
  });
};

export const useDeleteTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(SupportApiService.deleteSupport, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.SUPPORT],
      });
      onSuccess?.();
    },
  });
};
