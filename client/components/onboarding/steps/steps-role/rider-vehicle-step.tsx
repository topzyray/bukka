"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { riderVehicleSchema } from "@/server/schemas/onboarding";
import { useOnboarding } from "@/providers/onboarding-provider";
import { InputComponent } from "@/components/forms/base/input-component";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/utils/upload-utils";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

export default function RiderVehicleStep({ onNext, onBack, finalize }: any) {
  const { state, actions } = useOnboarding();
  const form = useForm({
    resolver: zodResolver(riderVehicleSchema),
    defaultValues: state.roleSpecific ?? undefined,
    mode: "all",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (data: any) => {
    setLoading(true);
    try {
      // if license image is included, upload it before proceeding
      if (data.licenseImageFile instanceof File) {
        const res = await uploadFile(data.licenseImageFile, "DRIVER_LICENSE");
        data.licenseImageUrl = res?.url ?? res;
      }
      actions.setRoleSpecific(data);

      // either go to next step or finalize if this is last role-specific step
      if (finalize) await finalize();
      else onNext();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save vehicle details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <InputComponent
          formControl={form.control}
          formName="vehicleMake"
          formInputType="text"
          formPlaceholder="Vehicle Make"
        />
        <InputComponent
          formControl={form.control}
          formName="vehicleModel"
          formInputType="text"
          formPlaceholder="Vehicle Model"
        />
        <InputComponent
          formControl={form.control}
          formName="plateNumber"
          formInputType="text"
          formPlaceholder="Plate Number"
        />

        {/* For file input you can reuse ImageUploader or create a simple File input */}
        <div>
          <label className="block text-sm font-medium">
            Driver License (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              form.setValue("licenseImageFile", e.target.files?.[0] ?? null)
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
