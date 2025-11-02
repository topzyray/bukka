// "use client";

// import { useRef, useState } from "react";
// import { Upload, X, Star } from "lucide-react";
// import Image from "next/image";
// import clsx from "clsx";
// import { Card, CardContent } from "./card";
// import { Button } from "./button";
// import { Input } from "./input";
// import { FileHelper } from "@/helpers/file-helper";
// import { cn } from "@/lib/utils";

// interface IImageUploaderProp {
//   onChange: (files: File[] | File | null) => void;
//   label?: string;
//   isMultiple?: boolean;
// }

// export const ImageUploader = ({
//   onChange,
//   label,
//   isMultiple = false,
// }: IImageUploaderProp) => {
//   const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
//   const [coverIndex, setCoverIndex] = useState<number | null>(null);
//   const [isvalidFile, setIsValidFile] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files ? Array.from(e.target.files) : [];
//     if (!files.length) return;

//     const validFiles = await FileHelper.validateFile(files);

//     if (validFiles.length) {
//       setIsValidFile(true);
//     }

//     const mapped = validFiles.map((file) => ({
//       file,
//       url: URL.createObjectURL(file),
//     }));

//     const updated = isMultiple ? [...previews, ...mapped] : mapped;
//     setPreviews(updated);

//     if (isMultiple) {
//       onChange(updated.map((item) => item.file));
//     } else {
//       onChange(updated[0]?.file ?? null);
//     }
//   };

//   const handleRemove = (index: number) => {
//     const updated = previews.filter((_, i) => i !== index);
//     setPreviews(updated);
//     setIsValidFile(false);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     if (isMultiple) {
//       onChange(updated.map((item) => item.file));
//     } else {
//       onChange(updated[0]?.file ?? null);
//     }
//     if (index === coverIndex) setCoverIndex(null);
//   };

//   const handleSelectCover = (index: number) => {
//     if (index === coverIndex) return;
//     const newPreviews = [...previews];
//     const [selected] = newPreviews.splice(index, 1);
//     newPreviews.unshift(selected);
//     setPreviews(newPreviews);
//     setCoverIndex(0);
//     if (isMultiple) {
//       onChange(newPreviews.map((item) => item.file));
//     }
//   };

//   const handleClick = () => fileInputRef.current?.click();

//   return (
//     <section className="flex flex-col gap-0 w-full">
//       {/* Upload Box */}
//       <div
//         className={cn(
//           "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/40 cursor-pointer hover:bg-muted/60 hover:shadow-md transition-all text-center"
//           // isvalidFile ? "border-green-600 border-2 border-dashed" : ""
//         )}
//         onClick={handleClick}
//         tabIndex={0}
//         onKeyDown={(e) => e.key === "Enter" && handleClick()}
//       >
//         <Upload className="w-8 h-8 text-muted-foreground mb-2" />
//         <p className="text-sm text-muted-foreground">
//           {label ||
//             (isMultiple
//               ? "Upload multiple photos (max 5)"
//               : "Upload your profile image")}
//         </p>
//         <p className="text-sm">Note: Max Size 200kb</p>
//         <Input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFiles}
//           className="hidden"
//           accept="image/*"
//           multiple={isMultiple}
//         />
//       </div>

//       {/* Preview Section */}
//       {previews.length > 0 ? (
//         <div
//           className={clsx(
//             "grid gap-4 mt-2",
//             isMultiple
//               ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
//               : "grid-cols-1 place-items-center"
//           )}
//         >
//           {previews.map((item, index) => (
//             <div
//               key={index}
//               className={clsx(
//                 "relative group rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-lg transition-all",
//                 index === coverIndex && "ring-2 ring-primary"
//               )}
//             >
//               <Image
//                 src={item.url}
//                 alt={`Preview ${index + 1}`}
//                 width={200}
//                 height={200}
//                 className="object-cover w-full h-32 sm:h-36 md:h-40"
//               />

//               {/* Remove Button */}
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => handleRemove(index)}
//                 className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition"
//               >
//                 <X className="w-4 h-4 text-destructive" />
//               </Button>

//               {/* Cover Selection (Business only) */}
//               {isMultiple && (
//                 <button
//                   type="button"
//                   onClick={() => handleSelectCover(index)}
//                   className={clsx(
//                     "absolute bottom-1 left-2 flex items-center gap-1 text-xs font-medium rounded-md px-1.5 py-0.5 transition-all",
//                     index === coverIndex
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-background/80 text-muted-foreground hover:bg-background"
//                   )}
//                 >
//                   <Star
//                     className={clsx(
//                       "w-3 h-3",
//                       index === coverIndex && "fill-current"
//                     )}
//                   />
//                   {index === coverIndex ? "Cover" : "Set cover"}
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <Card className="flex justify-center items-center border-dashed border-2 text-primary mt-2 min-h-[80px]">
//           <CardContent className="text-sm text-muted-foreground">
//             No image selected yet.
//           </CardContent>
//         </Card>
//       )}
//     </section>
//   );
// };

"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, Star, Camera } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Input } from "./input";
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

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hidden file inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraRef = useRef<HTMLInputElement | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      // revoke preview object URLs
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Common file handler (used by file input and camera capture result)
  const handleFiles = async (filesArg: File[] | FileList | null) => {
    const files = filesArg ? Array.from(filesArg as File[]) : [];
    if (!files.length) return;

    const validFiles = await FileHelper.validateFile(files);
    if (validFiles.length) setIsValidFile(true);

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

  // Handler for hidden file inputs' native change event
  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(e.target.files);
  };

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setIsValidFile(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mobileCameraRef.current) mobileCameraRef.current.value = "";

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
    } else {
      onChange(newPreviews[0]?.file ?? null);
    }
  };

  const handleClickUpload = () => fileInputRef.current?.click();

  // Main camera button: mobile -> native capture input, desktop -> getUserMedia live preview
  const handleClickCamera = async () => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      mobileCameraRef.current?.click();
      return;
    }

    // Desktop: start live camera preview
    setIsStartingCamera(true);
    try {
      // Request camera; prefer environment (rear) by default, fallback to any available
      const constraints: MediaStreamConstraints = {
        video: { facingMode: "environment" as any },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        // Some browsers need an explicit play() call and wait for metadata
        try {
          await videoRef.current.play();
        } catch (err) {
          // If autoplay blocked, user will still see a black video until they interact; still set active
          // We keep active state so UI shows capture controls
        }
      }

      setIsCameraActive(true);
    } catch (err) {
      console.error("Failed to access camera:", err);
      // If camera permission denied or unavailable, fallback to file input
      fileInputRef.current?.click();
    } finally {
      setIsStartingCamera(false);
    }
  };

  // Capture snapshot from video -> file -> reuse handleFiles
  const handleCaptureSnapshot = async () => {
    if (!videoRef.current) return;

    // Ensure video has dimensions
    const video = videoRef.current;
    const width = video.videoWidth || video.clientWidth;
    const height = video.videoHeight || video.clientHeight;
    if (!width || !height) {
      // try waiting for loadedmetadata
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        video.addEventListener("loadedmetadata", onLoaded);
        // timeout fallback
        setTimeout(() => {
          try {
            video.removeEventListener("loadedmetadata", onLoaded);
          } catch {}
          resolve();
        }, 500);
      });
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || video.clientWidth || 640;
    canvas.height = video.videoHeight || video.clientHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror front camera if needed (we used facingMode environment, but just draw normally)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create File
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const file = new File([blob], "camera-photo.jpg", {
          type: blob.type || "image/jpeg",
        });

        // reuse existing validation + preview flow
        await handleFiles([file]);

        // stop camera
        stopCameraStream();
        setIsCameraActive(false);
      },
      "image/jpeg",
      0.92
    );
  };

  const handleCancelCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      {/* Upload / Camera Buttons */}
      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClickUpload}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload from Files
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleClickCamera}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Use Camera
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <Input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        className="hidden"
        accept="image/*"
        multiple={isMultiple}
      />
      {/* Mobile camera capture input */}
      <Input
        type="file"
        ref={mobileCameraRef}
        onChange={onFileInputChange}
        className="hidden"
        accept="image/*"
        capture="environment"
      />

      {/* Live Camera Preview (Desktop) */}
      {isCameraActive && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg border border-border w-full max-w-md bg-black"
          />
          <div className="flex gap-2">
            <Button onClick={handleCaptureSnapshot} disabled={isStartingCamera}>
              Capture Photo
            </Button>
            <Button onClick={handleCancelCamera} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {!isCameraActive && previews.length > 0 ? (
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
        !isCameraActive && (
          <Card className="flex justify-center items-center border-dashed border-2 text-primary mt-2 min-h-[80px]">
            <CardContent className="text-sm text-muted-foreground">
              No image selected yet.
            </CardContent>
          </Card>
        )
      )}
    </section>
  );
};
