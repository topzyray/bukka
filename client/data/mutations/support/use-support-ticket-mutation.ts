import { useCustomMutation } from "../base";
import { SupportApiService } from "@/data/services";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(SupportApiService.createTicket, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: ["supports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support"],
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
        queryKey: ["supports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support"],
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
        queryKey: ["supports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support"],
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
        queryKey: ["supports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support"],
      });
      onSuccess?.();
    },
  });
};
