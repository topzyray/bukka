"use client";

import React, { useState } from "react";
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
import { ImageUploader } from "@/components/onboarding/image-uploader";
import { uploadFile } from "@/utils/upload-utils";
import { useOnboarding } from "@/providers/onboarding-provider";
import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/server/hooks/user/use-user";
import { toast } from "sonner";
import { OnboardingProgressDto } from "@/server/dtos/UserDto";

const imageUploadSchema = z.object({
  avatar: z.instanceof(File, { message: "Please upload an image file" }),
});

type ImageUploadFormData = z.infer<typeof imageUploadSchema>;

export default function ImageUploadStep({
  onNext,
  isLast,
  stepIndex = 0,
}: {
  onNext: () => void;
  isLast?: boolean;
  stepIndex?: number;
}) {
  const { userDetails } = useAuth();
  const { actions } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const form = useForm<ImageUploadFormData>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      avatar: undefined,
    },
    mode: "onChange",
  });

  const { updateUserMutation, saveOnboardingProgressMutation } = useUser({
    resetForm: form.reset,
  });

  const handleSubmit = async (values: ImageUploadFormData) => {
    if (!userDetails?.id) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Upload file
      const file = values.avatar;
      const res = await uploadFile(file, "USER_PROFILE_IMAGE");
      const url = (res && (res.url || res)) ?? null;

      if (!url) {
        throw new Error("Upload failed: invalid response");
      }

      // 2️⃣ Update user in backend
      await updateUserMutation.mutateAsync({
        userId: userDetails.id,
        avatar: url,
      });

      // 3️⃣ Save onboarding progress
      const progressPayload: OnboardingProgressDto = {
        userId: userDetails.id,
        stepIndex,
      };
      await saveOnboardingProgressMutation.mutateAsync(progressPayload);

      // 4️⃣ Persist locally
      actions.setUploadedImage(file, url);

      toast.success("Profile image uploaded successfully!");
      onNext();
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold mb-2">
        Upload your profile picture
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Recommended size: 300x300px
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    label="Select image"
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
            <Button type="submit" disabled={loading || !form.formState.isValid}>
              {loading
                ? "Uploading..."
                : isLast
                ? "Finish"
                : "Upload & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
