import { useCustomMutation } from "@/server/mutations/base";
import { useState } from "react";

interface UseFileUploadProps<T> {
  uploadFn: (params: FormData | any) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

/**
 * Generic file upload hook.
 * Handles single/multiple file uploads and optional extra form data.
 *
 * USE CASES:
 *
 * 1️⃣ Single file upload:
 *    handleFileUpload(file, { userId: 123 })
 *
 * 2️⃣ Multiple file upload:
 *    handleFileUpload([file1, file2], { albumId: 456 })
 *
 * 3️⃣ File upload with additional data:
 *    handleFileUpload(file, { referenceId: 789, isPublic: true })
 *
 * 4️⃣ Only raw files without extra data:
 *    handleFileUpload(file)
 *
 * @template T The response type returned from uploadFn
 */
export const useFileUpload = <T,>({
  uploadFn,
  onSuccess,
  onError,
}: UseFileUploadProps<T>) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useCustomMutation(uploadFn, {
    onSuccessCallback: (data) => {
      setIsUploading(false);
      onSuccess?.(data);
    },
    onErrorCallback: (error) => {
      setIsUploading(false);
      onError?.(error);
    },
  });

  /**
   * Handles single or multiple file uploads, optionally with other form fields.
   *
   * @param files - A single File or an array of Files
   * @param extraData - Optional extra form data (e.g. { userId: 123, caption: "hello" })
   * @param fieldName - The name of the form field for the file(s), defaults to "file"
   */
  const handleFileUpload = (
    files: File | File[],
    extraData?: Record<string, any>,
    fieldName: string = "file"
  ) => {
    if (!files) return;

    setIsUploading(true);
    const formData = new FormData();

    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => formData.append(fieldName, file)); // must match backend

    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value)); // serialize objects
        } else {
          formData.append(key, String(value)); // string/number/boolean
        }
      });
    }

    uploadMutation.mutate(formData);
  };

  // const handleFileUpload = (
  //   files: File | File[],
  //   extraData?: Record<string, any>,
  //   fieldName: string = "file"
  // ) => {
  //   if (!files) return;

  //   setIsUploading(true);
  //   const formData = new FormData();

  //   // Convert to array if single file
  //   const fileArray = Array.isArray(files) ? files : [files];
  //   fileArray.forEach((file) => formData.append(fieldName, file));

  //   // Append additional data
  //   if (extraData) {
  //     Object.entries(extraData).forEach(([key, value]) => {
  //       // FormData only accepts string | Blob
  //       if (value instanceof Blob) {
  //         formData.append(key, value);
  //       } else {
  //         formData.append(key, String(value));
  //       }
  //     });
  //   }

  //   uploadMutation.mutate(formData);
  // };

  /**
   * Optional helper to handle `<input type="file">` change events directly.
   * Extracts the files and calls `handleFileUpload`.
   *
   * @param event - Change event from an input element
   * @param extraData - Optional additional form data
   * @param fieldName - FormData key name, defaults to "file"
   */
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    extraData?: Record<string, any>,
    fieldName: string = "file"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    handleFileUpload(fileArray, extraData, fieldName);
  };

  return { handleFileUpload, handleFileInputChange, isUploading };
};
