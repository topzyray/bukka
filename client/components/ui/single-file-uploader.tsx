import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FilePenIcon, LoaderCircle } from "lucide-react";
import { useFileUpload } from "@/data/mutations/file/use-file-uploader";
import { cn } from "@/lib/utils";

interface ISingleFileUploader<T, P> {
  title: string;
  formName?: string;
  extraParams?: P;
  uploadFn: (params: P) => Promise<T>;
  onUploadSuccess?: (data: T) => void;
  onUploadFailure?: (data: T) => void;
}

export const SingleFileUploader: React.FC<ISingleFileUploader<any, any>> = ({
  title,
  formName = "file",
  extraParams,
  uploadFn,
  onUploadSuccess,
  onUploadFailure,
}) => {
  const { handleFileInputChange, isUploading } = useFileUpload({
    uploadFn,
    onSuccess: onUploadSuccess,
    onError: onUploadFailure,
  });

  return (
    <div className={cn("absolute right-4 bottom-1.5")}>
      <Label
        title={title}
        className={cn(
          "flex items-center rounded-full border border-white/50 bg-primary-foreground/80 p-1 shadow-lg backdrop-blur transition hover:bg-primary-foreground/70",
          isUploading ? "cursor-not-allowed" : "cursor-pointer "
        )}
      >
        {!isUploading && <FilePenIcon className="w-5 h-5" />}
        {isUploading && <LoaderCircle className="w-5 h-5 animate-spin" />}
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleFileInputChange(event, extraParams, formName)
          }
          disabled={isUploading}
        />
      </Label>
    </div>
  );
};
