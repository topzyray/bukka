import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "../base";
import { SupportApiService } from "@/data/services";
import { queryClient } from "@/lib";

export const useCreateTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
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
