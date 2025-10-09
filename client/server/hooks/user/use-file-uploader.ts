import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { FileApiService } from "@/server/services/FileApiService";

export const useFileUploader = () => {
  const fileUploaderMutation = useCustomMutation(FileApiService.uploadFile, {
    onSuccessCallback: () => {},
    onErrorCallback: () => {},
  });

  return {
    fileUploaderMutation,
  };
};
