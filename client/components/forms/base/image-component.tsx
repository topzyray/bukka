"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface IImageComponentProps {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  disabled: boolean;
  multiple?: boolean;
}

export default function ImageComponent({
  formControl,
  formName,
  formLabel,
  disabled,
  multiple,
}: IImageComponentProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for input field

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleRemoveImage = (
    index: number,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    // Revoke old URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);

    // Reset file input value to allow re-selection of the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Correctly update field value
    field.onChange(multiple ? updatedFiles : updatedFiles[0] || null);
  };

  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg">{formLabel}</FormLabel>
          <FormControl>
            <Input
              ref={fileInputRef} // Attach ref to input field
              className="h-12"
              disabled={disabled}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={(event) => {
                const files = event.target.files;
                if (!files) return;

                const newFiles = Array.from(files);
                const updatedFiles = multiple
                  ? [...selectedFiles, ...newFiles] // Append new images
                  : newFiles; // Replace for single file selection

                const previewUrls = updatedFiles.map((file) =>
                  URL.createObjectURL(file)
                );

                setSelectedFiles(updatedFiles);
                setPreviews(previewUrls);

                field.onChange(
                  multiple ? updatedFiles : updatedFiles[0] || null
                );
              }}
            />
          </FormControl>
          <FormMessage />

          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((src, index) => (
                <div key={index} className="group relative h-20 w-20">
                  <Image
                    src={src}
                    width={80}
                    height={80}
                    alt={`Preview ${index}`}
                    className="h-full w-full rounded-md border object-cover"
                  />

                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveImage(index, field)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
