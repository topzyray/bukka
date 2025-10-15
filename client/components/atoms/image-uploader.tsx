"use client";

import { useRef, useState } from "react";
import { Upload, X, Star } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileHelper } from "@/helpers/file-helper";
import { cn } from "@/lib/utils";

interface IImageUploaderProp {
  onChange: (files: File[] | File | null) => void;
  label?: string;
  isMultiple?: boolean;
}

export const ImageUploader = ({
  onChange,
  label,
  isMultiple = false,
}: IImageUploaderProp) => {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [isvalidFile, setIsValidFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    const validFiles = await FileHelper.validateFile(files);

    if (validFiles.length) {
      setIsValidFile(true);
    }

    const mapped = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = isMultiple ? [...previews, ...mapped] : mapped;
    setPreviews(updated);

    if (isMultiple) {
      onChange(updated.map((item) => item.file));
    } else {
      onChange(updated[0]?.file ?? null);
    }
  };

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setIsValidFile(false);
    if (isMultiple) {
      onChange(updated.map((item) => item.file));
    } else {
      onChange(updated[0]?.file ?? null);
    }
    if (index === coverIndex) setCoverIndex(null);
  };

  const handleSelectCover = (index: number) => {
    if (index === coverIndex) return;
    const newPreviews = [...previews];
    const [selected] = newPreviews.splice(index, 1);
    newPreviews.unshift(selected);
    setPreviews(newPreviews);
    setCoverIndex(0);
    if (isMultiple) {
      onChange(newPreviews.map((item) => item.file));
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  return (
    <section className="flex flex-col gap-0 w-full">
      {/* Upload Box */}
      <div
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/40 cursor-pointer hover:bg-muted/60 hover:shadow-md transition-all text-center"
          // isvalidFile ? "border-green-600 border-2 border-dashed" : ""
        )}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {label ||
            (isMultiple
              ? "Upload multiple photos (max 5)"
              : "Upload your profile image")}
        </p>
        <p className="text-sm">Note: Max Size 200kb</p>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFiles}
          className="hidden"
          accept="image/*"
          multiple={isMultiple}
        />
      </div>

      {/* Preview Section */}
      {previews.length > 0 ? (
        <div
          className={clsx(
            "grid gap-4 mt-2",
            isMultiple
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              : "grid-cols-1 place-items-center"
          )}
        >
          {previews.map((item, index) => (
            <div
              key={index}
              className={clsx(
                "relative group rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-lg transition-all",
                index === coverIndex && "ring-2 ring-primary"
              )}
            >
              <Image
                src={item.url}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="object-cover w-full h-32 sm:h-36 md:h-40"
              />

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>

              {/* Cover Selection (Business only) */}
              {isMultiple && (
                <button
                  type="button"
                  onClick={() => handleSelectCover(index)}
                  className={clsx(
                    "absolute bottom-1 left-2 flex items-center gap-1 text-xs font-medium rounded-md px-1.5 py-0.5 transition-all",
                    index === coverIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/80 text-muted-foreground hover:bg-background"
                  )}
                >
                  <Star
                    className={clsx(
                      "w-3 h-3",
                      index === coverIndex && "fill-current"
                    )}
                  />
                  {index === coverIndex ? "Cover" : "Set cover"}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card className="flex justify-center items-center border-dashed border-2 text-primary mt-2 min-h-[80px]">
          <CardContent className="text-sm text-muted-foreground">
            No image selected yet.
          </CardContent>
        </Card>
      )}
    </section>
  );
};
