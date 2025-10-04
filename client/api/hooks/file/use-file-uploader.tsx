import { useCustomMutation } from "@/api/queries/use-mutation.hook";
import { useState } from "react";

interface UseFileUploadProps<T, P> {
  uploadFn: (params: P) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export const useFileUpload = <T, P>({
  uploadFn,
  onSuccess,
  onError,
}: UseFileUploadProps<T, P>) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useCustomMutation(uploadFn, {
    onSuccessCallback: (data) => {
      if (onSuccess) onSuccess(data);
      setIsUploading(false);
    },
    onErrorCallback: (error) => {
      if (onError) onError(error);
      setIsUploading(false);
    },
  });

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    extraParams?: P,
    formName?: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(formName as string, file);

    // Merge additional params if needed
    const uploadParams = { ...extraParams, formData } as P;

    console.log("UPLOAD PARAMS: ", uploadParams);

    uploadMutation.mutate(uploadParams);
  };

  return { handleFileUpload, isUploading };
};
