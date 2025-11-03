"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Upload, X, Camera } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { FileHelper } from "@/helpers/file-helper";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface IImageUploaderProp {
  onChange: (files: File[] | File | null) => void;
  isMultiple?: boolean;
  useRearCamera?: boolean;
}

export const ImageUploader = ({
  onChange,
  isMultiple = false,
  useRearCamera = false,
}: IImageUploaderProp) => {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [useRearCameraState, setUseRearCameraState] = useState(useRearCamera);
  const [switching, setSwitching] = useState(false);
  const [flash, setFlash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
      previews.forEach((p) => URL.revokeObjectURL(p?.url));
    };
  }, [previews]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleFiles = async (filesArg: File[] | FileList | null) => {
    const files = filesArg ? Array.from(filesArg) : [];
    if (!files.length) return;

    const validFiles = await FileHelper.validateFile(files);

    const resizedFiles = await Promise.all(
      validFiles.map(async (file) => {
        if (file.size > 2 * 1024 * 1024) {
          return await resizeImage(file, 1024, 1024);
        }
        return file;
      })
    );

    const mapped = resizedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = isMultiple ? [...previews, ...mapped] : mapped;
    setPreviews(updated);
    onChange(
      isMultiple ? updated.map((p) => p.file) : updated[0]?.file ?? null
    );
  };

  const resizeImage = useCallback(
    async (file: File, maxW: number, maxH: number) => {
      const img = document.createElement("img");
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      img.src = dataUrl;
      await new Promise((res) => (img.onload = res));

      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
      );
      return new File([blob], file.name, { type: "image/jpeg" });
    },
    []
  );

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]?.url);
    setPreviews(updated);
    onChange(
      isMultiple ? updated.map((i) => i.file) : updated[0]?.file ?? null
    );
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const handleCameraClick = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (isMobile) {
      // Use rear or front camera for mobile uploads
      if (mobileCameraRef.current) {
        if (useRearCamera) {
          mobileCameraRef.current.setAttribute("capture", "environment");
        } else {
          mobileCameraRef.current.setAttribute("capture", "user");
        }
      }
      mobileCameraRef.current?.click();
      return;
    }

    try {
      setLoadingCamera(true);
      stopCamera();

      // Dynamically choose camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: useRearCameraState ? "environment" : "user" },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      requestAnimationFrame(async () => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await new Promise<void>((resolve) => {
            video.onloadedmetadata = () => resolve();
          });
          await video.play().catch(() => {});
        }
      });
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Camera Failure", {
        description:
          "Unable to access your camera. Check permissions or use HTTPS.",
      });
    } finally {
      setLoadingCamera(false);
    }
  };

  const handleCapture = async () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        await handleFiles([file]);
        stopCamera();
        setIsCameraActive(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const handleCancelCamera = () => {
    stopCamera();
    setIsCameraActive(false);
  };

  const handleSwitchCamera = async () => {
    if (switching || !navigator.mediaDevices?.getUserMedia) return;
    setSwitching(true);
    const newFacingMode = !useRearCameraState;
    setUseRearCameraState(newFacingMode);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode ? "environment" : "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });
        await videoRef.current!.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera switch error:", err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={handleUploadClick}>
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>
        <Button
          variant="outline"
          onClick={handleCameraClick}
          disabled={loadingCamera}
        >
          <Camera className="w-4 h-4 mr-2" />
          {loadingCamera ? "Opening..." : "Use Camera"}
        </Button>
      </div>

      {/* Hidden inputs */}
      <Input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        accept="image/*"
        multiple={isMultiple}
      />
      <Input
        type="file"
        ref={mobileCameraRef}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        accept="image/*"
        capture={useRearCamera ? "environment" : "user"} // rear camera for mobile
      />

      {isCameraActive && (
        <Card className="w-full border-dashed border text-center py-4  min-h-26 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={useRearCameraState ? "rear" : "front"}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="rounded-lg border w-full max-w-sm bg-black overflow-hidden perspective-1000"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button size="sm" onClick={handleCapture}>
                Capture
              </Button>
              {isMobile && (
                <Button
                  size="sm"
                  onClick={handleSwitchCamera}
                  variant="outline"
                >
                  Switch Camera
                </Button>
              )}
              <Button size="sm" onClick={handleCancelCamera} variant="ghost">
                Cancel
              </Button>
            </div>

            {flash && (
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </Card>
      )}

      {!isCameraActive && previews.length > 0 && (
        <div
          className={clsx(
            "grid gap-4 mt-2",
            isMultiple
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              : "grid-cols-1 place-items-center"
          )}
        >
          {previews.map((item, i) => (
            <Card
              key={i}
              className="w-full border-dashed border text-center py-4  min-h-26 flex items-center justify-center"
            >
              <div className="relative group rounded-xl overflow-hidden border">
                <Image
                  src={item.url}
                  alt="preview"
                  width={200}
                  height={200}
                  className="object-cover w-full h-36"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemove(i)}
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
                {isMultiple && (
                  <button
                    type="button"
                    onClick={() => setCoverIndex(i)}
                    className={clsx(
                      "absolute bottom-2 left-2 px-2 py-1 text-xs rounded-md",
                      i === coverIndex
                        ? "bg-primary text-white"
                        : "bg-white/70 text-black"
                    )}
                  >
                    {i === coverIndex ? "Cover" : "Set cover"}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isCameraActive && previews.length === 0 && (
        <Card className="border-dashed border text-center py-4  min-h-40 flex items-center justify-center">
          <CardContent className="text-muted-foreground text-sm">
            No image selected yet.
          </CardContent>
        </Card>
      )}
    </section>
  );
};
