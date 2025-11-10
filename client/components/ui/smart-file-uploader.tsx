"use client";

import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileHelper } from "@/helpers/file-helper";
import { motion, AnimatePresence } from "framer-motion";
import { useFileUpload } from "@/data/mutations/file/use-file-uploader";
import { Button, Card, CardContent, Label, Input } from "@/components/ui";
import {
  FilePenIcon,
  LoaderCircle,
  Upload,
  X,
  Camera,
  Loader2,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback, ReactNode } from "react";

interface ISmartFileUploader<T, P> {
  title: string;
  formName?: string;
  extraParams?: P;
  uploadFn: (params: P) => Promise<T>;
  onUploadSuccess?: (data: T) => void;
  onUploadFailure?: (data: T) => void;
  useCameraModal?: boolean;
  isMultiple?: boolean;
  useRearCamera?: boolean;
  cameraModalTrigger?: ReactNode;
}

export const SmartFileUploader: React.FC<ISmartFileUploader<any, any>> = ({
  title,
  formName = "file",
  extraParams,
  uploadFn,
  onUploadSuccess,
  onUploadFailure,
  useCameraModal = false,
  isMultiple = false,
  useRearCamera = false,
  cameraModalTrigger,
}) => {
  const { handleFileInputChange, isUploading } = useFileUpload({
    uploadFn,
    onSuccess: (data) => {
      setUploadCompleted(true);
      onUploadSuccess?.(data);
    },
    onError: (err) => {
      setUploadCompleted(false);
      onUploadFailure?.(err);
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [useRearCameraState, setUseRearCameraState] = useState(useRearCamera);
  const [switching, setSwitching] = useState(false);
  const [flash, setFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  useEffect(() => {
    return () => {
      stopCamera();
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  useEffect(() => {
    if (!isUploading && uploadCompleted && useCameraModal) {
      setShowModal(false);
      setPreviews([]);
      setUploadCompleted(false);
    }
  }, [isUploading, uploadCompleted, useCameraModal]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
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
  };

  const handleUploadFromModal = async () => {
    if (!previews.length) return;
    const files = isMultiple ? previews.map((p) => p.file) : [previews[0].file];
    for (const f of files) {
      const event = {
        target: { files: [f] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileInputChange(event, extraParams, formName);
    }
  };

  const handleCameraClick = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      setLoadingCamera(true);
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useRearCameraState ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
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

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]?.url);
    setPreviews(updated);
  };

  const handleCloseModal = () => {
    stopCamera();
    setIsCameraActive(false);
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal) {
      stopCamera();
      setIsCameraActive(false);
    }
  }, [showModal]);

  if (!useCameraModal) {
    return (
      <div className={cn("absolute right-4 bottom-1.5")}>
        <Label
          title={title}
          className={cn(
            "flex items-center rounded-full border border-primary/50 dark:border-primary/50 bg-primary-foreground/80 p-1 shadow-lg backdrop-blur transition hover:bg-primary-foreground/70",
            isUploading ? "cursor-not-allowed" : "cursor-pointer "
          )}
        >
          {!isUploading && <FilePenIcon className="w-5 h-5 text-primary" />}
          {isUploading && (
            <LoaderCircle className="w-5 h-5 animate-spin text-primary" />
          )}
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
  }

  return (
    <div>
      <div onClick={() => setShowModal(true)}>
        {cameraModalTrigger ? (
          cameraModalTrigger
        ) : (
          <div className={cn("absolute right-4 bottom-1.5")}>
            <Label
              className={cn(
                "cursor-pointer flex items-center rounded-full border border-primary/50 bg-primary-foreground/80 p-1 shadow-lg backdrop-blur transition hover:bg-primary-foreground/70"
              )}
            >
              <FilePenIcon className="w-5 h-5 text-primary" />
            </Label>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
            style={{ zIndex: 1001 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="w-full max-w-lg bg-white relative p-4 rounded-xl">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCloseModal}
              >
                <X />
              </Button>

              <div className="flex justify-center gap-2 mb-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
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

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={isMultiple}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              {isCameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="rounded-lg w-full"
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button onClick={handleCapture}>Capture</Button>
                    {isMobile && (
                      <Button onClick={handleSwitchCamera} variant="outline">
                        Switch
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsCameraActive(false);
                        stopCamera();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : previews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {previews.map((item, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden border"
                    >
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
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border text-center py-4 min-h-40 flex items-center justify-center mt-4">
                  <CardContent className="text-muted-foreground text-sm">
                    No image selected yet.
                  </CardContent>
                </Card>
              )}

              {!isCameraActive && previews.length > 0 && (
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleUploadFromModal}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              )}

              {flash && (
                <motion.div
                  className="absolute inset-0 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
