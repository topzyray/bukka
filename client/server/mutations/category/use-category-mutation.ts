import { useAuth } from "@/providers";
import { useCustomMutation } from "@/server/mutations/base";
import { BusinessCategoryApiService } from "@/server/services/BusinessCategoryApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateCategory = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useCustomMutation(BusinessCategoryApiService.createCategory, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-categories", user?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin:business-categories"],
      });
      onSuccess?.();
    },
  });
};

// export const useUpdateBusiness = ({
//   onSuccess,
// }: {
//   onSuccess?: () => void;
// }) => {
//   const queryClient = useQueryClient();
//   return useCustomMutation(
//     ({ id, payload }: { id: number; payload: any }) =>
//       BusinessApiService.updateBusiness(id, payload),
//     {
//       onSuccessCallback: async () => {
//         await queryClient.invalidateQueries({ queryKey: ["businesses"] });
//         onSuccess?.();
//       },
//     }
//   );
// };

// export const useDeleteBusiness = ({
//   onSuccess,
// }: {
//   onSuccess?: () => void;
// }) => {
//   const queryClient = useQueryClient();
//   return useCustomMutation(BusinessApiService.deleteBusiness, {
//     onSuccessCallback: async () => {
//       await queryClient.invalidateQueries({ queryKey: ["businesses"] });
//       onSuccess?.();
//     },
//   });
// };
