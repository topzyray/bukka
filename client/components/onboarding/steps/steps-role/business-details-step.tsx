"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailsSchema } from "@/server/schemas/onboarding";
import { useOnboarding } from "@/providers/onboarding-provider";
import { InputComponent } from "@/components/forms/base/input-component";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/atoms/image-uploader";
import { uploadFile } from "@/utils/upload-utils";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

export default function BusinessDetailsStep({ onNext, onBack, finalize }: any) {
  const { state, actions } = useOnboarding();
  const form = useForm({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: state.roleSpecific ?? undefined,
    mode: "all",
  });
  const [localImages, setLocalImages] = useState<File[]>(
    state.roleSpecific?.businessImages ?? []
  );
  const [loading, setLoading] = useState(false);

  const submit = async (data: any) => {
    setLoading(true);
    try {
      // if business images exist, upload each
      if (localImages.length) {
        const uploaded = await Promise.all(
          localImages.map((f) => uploadFile(f, "BUSINESS_IMAGE"))
        );
        data.businessImageUrls = uploaded.map((r) => r?.url ?? r);
      }
      actions.setRoleSpecific({ ...data, businessImages: undefined });
      if (finalize) await finalize();
      else onNext();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save business details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <InputComponent
          formControl={form.control}
          formName="businessName"
          formInputType="text"
          formPlaceholder="Business name"
        />
        <InputComponent
          formControl={form.control}
          formName="businessType"
          formInputType="text"
          formPlaceholder="Type (e.g., Restaurant)"
        />
        <InputComponent
          formControl={form.control}
          formName="businessAddress"
          formInputType="text"
          formPlaceholder="Address"
        />

        <div>
          <label className="block text-sm font-medium">Business Images</label>
          <ImageUploader
            isMultiple
            onChange={(files) =>
              setLocalImages(
                Array.isArray(files) ? files : files ? [files] : []
              )
            }
          />
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : finalize ? "Finish" : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
