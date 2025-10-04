import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FilePenIcon, LoaderCircle } from "lucide-react";
import { useFileUpload } from "@/api/hooks/file/use-file-uploader";

interface FileUploadProps<T, P> {
  uploadFn: (params: P) => Promise<T>;
  extraParams?: P;
  formName: string;
  onUploadSuccess?: (data: T) => void;
  onUploadFailure?: (data: T) => void;
}

export const FileUploader: React.FC<FileUploadProps<any, any>> = ({
  uploadFn,
  extraParams,
  formName,
  onUploadSuccess,
  onUploadFailure,
}) => {
  const { handleFileUpload, isUploading } = useFileUpload({
    uploadFn,
    onSuccess: onUploadSuccess,
    onError: onUploadFailure,
  });

  return (
    <div className="absolute right-2 bottom-2 lg:right-5 lg:bottom-5">
      <Label className="flex cursor-pointer items-center rounded-full border border-white/50 bg-black/20 p-1 shadow-lg backdrop-blur-md transition hover:bg-white/30">
        <FilePenIcon className="" />
        {isUploading ? (
          <span className="animate-spin text-sm text-gray-500">
            <LoaderCircle />
          </span>
        ) : (
          <span className="text-sm text-gray-700"></span>
        )}
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFileUpload(event, extraParams, formName)}
          disabled={isUploading}
        />
      </Label>
    </div>
  );
};
