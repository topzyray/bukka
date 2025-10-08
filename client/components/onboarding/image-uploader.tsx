"use client";

import { useRef, useState } from "react";
import { Upload, X, Star } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface IImageUploaderProp {
  onChange: (files: File[] | File | null) => void;
  label?: string;
  isBusiness?: boolean;
}

export const ImageUploader = ({
  onChange,
  label,
  isBusiness = false,
}: IImageUploaderProp) => {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = isBusiness ? [...previews, ...mapped] : mapped;
    setPreviews(updated);

    if (isBusiness) {
      onChange(updated.map((item) => item.file));
    } else {
      onChange(updated[0]?.file ?? null);
    }
  };

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (isBusiness) {
      onChange(updated.map((item) => item.file));
    } else {
      onChange(updated[0]?.file ?? null);
    }

    if (index === coverIndex) setCoverIndex(null);
  };

  const handleSelectCover = (index: number) => {
    if (index === coverIndex) return; // already selected

    const newPreviews = [...previews];
    const [selected] = newPreviews.splice(index, 1);
    newPreviews.unshift(selected);

    setPreviews(newPreviews);
    setCoverIndex(0); // cover is now the first one

    if (isBusiness) {
      onChange(newPreviews.map((item) => item.file));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="flex flex-col gap-4">
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-muted/40 cursor-pointer hover:shadow-md transition-all"
        onClick={handleClick}
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {label || (isBusiness ? "Select business images" : "Select image")}
        </p>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFiles}
          className="hidden"
          accept="image/*"
          multiple={isBusiness}
          max={5}
        />
      </div>

      {previews.length > 0 ? (
        <div
          className={clsx(
            "grid gap-4",
            isBusiness
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              : "grid-cols-1 place-items-center"
          )}
        >
          {previews.map((item, index) => (
            <div
              key={index}
              className={clsx(
                "relative group rounded-xl overflow-hidden border border-border bg-background shadow-sm transition-all hover:shadow-md",
                index === coverIndex && "ring-2 ring-primary"
              )}
            >
              <Image
                src={item.url}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="object-cover w-full h-24"
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

              {/* Cover Button (Business only) */}
              {isBusiness && (
                <button
                  type="button"
                  onClick={() => handleSelectCover(index)}
                  className={clsx(
                    "absolute bottom-0.5 left-2 cursor-pointer flex items-center gap-1 text-xs font-medium rounded-xl px-1.5 py-0.5 transition-all",
                    index === coverIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/70 text-muted-foreground hover:bg-background/90"
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
        <Card className="flex justify-center items-center border-dashed border-2 text-primary">
          <CardContent>
            <h3>No image selected yet.</h3>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
