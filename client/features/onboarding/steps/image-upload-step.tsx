"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
} from "@/data/enums";
import { useFileUpload } from "@/data/mutations/file/use-file-uploader";
import { FileApiService } from "@/data/services";
import { queryClient } from "@/lib";
import { useUpdateUserData } from "@/data/mutations/user/use-update-user-data";
import { useOnboardingProgress } from "@/data/queries/use-onboarding-progress-query";
import { UpdateUserDto } from "@/data/dtos";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { Loader2 } from "lucide-react";

const imageUploadSchema = z.object({
  profileImage: z.instanceof(File, { message: "Please upload an image file" }),
});

type ImageUploadFormData = z.infer<typeof imageUploadSchema>;

export function ImageUploadStep({
  onNext,
  isLast,
}: {
  onNext: () => void;
  isLast?: boolean;
  stepIndex?: number;
}) {
  const { user } = useAuth();

  const form = useForm<ImageUploadFormData>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      profileImage: undefined,
    },
    mode: "all",
  });

  const { mutateAsync: saveOnboardingProgressMutation, isPending } =
    useUpdateUserData({
      onSuccess: () => {
        form.reset();
      },
      toastStatusMessage: false,
    });

  const { data: savedProgress, isLoading: isFetchingProgress } =
    useOnboardingProgress(user?.id as number);

  const progressPayload: UpdateUserDto = {
    onboardingProgress: savedProgress + 1,
  };

  const { handleFileUpload, isUploading } = useFileUpload({
    uploadFn: async (formData: FormData) => FileApiService.uploadFile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.USER_FILES] });
      saveOnboardingProgressMutation(progressPayload);
      onNext();
    },
  });

  const onSubmit = async (data: ImageUploadFormData) => {
    if (!user?.id) {
      toast.error("User not found.", {
        description: "Please sign in again",
      });
      return;
    }

    const payload = {
      referenceType: FileReferenceTypeEnum.USER,
      category: FileCategoryEnum.USER_PROFILE_IMAGE,
      referenceId: user?.id,
      isPublic: true,
      metadata: {
        altText: `${user?.firstName} ${user?.lastName} - Profile Photo`,
      },
    };

    handleFileUpload(data?.profileImage, payload);
  };

  return (
    <div className="animate-in fade-in duration-300 border p-4 rounded-lg">
      <h2 className="text-base font-semibold mb-2">
        Upload your profile picture
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Recommended size: 300x300px
      </p>

      {isFetchingProgress ? (
        <CircularLoader text="Loading User Avatar Form" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      // label="Select image"
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 border-t border-border/30">
              <Button
                type="submit"
                disabled={isUploading || isPending || !form.formState.isValid}
              >
                {isUploading || isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Uploading...
                  </span>
                ) : isLast ? (
                  "Finish"
                ) : (
                  "Upload & Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
