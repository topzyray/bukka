"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Switch,
  BukkaButton,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { useAddFeaturedBusiness } from "@/data/mutations/business/use-business-mutation";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { SwitchComponent } from "@/components/form-ui/base/switch-component";
import { TextHelper } from "@/helpers";

const featureBusinessSchema = z
  .object({
    isFeatured: z.boolean(),
    featuredRank: z.coerce
      .number()
      .int()
      .min(1, "Rank must be at least 1")
      .optional(),
    featuredEnd: z.preprocess((arg) => {
      if (arg === "" || arg == null) return undefined;
      return typeof arg === "string" ? new Date(arg) : arg;
    }, z.date().optional()),
  })
  .refine((data) => !data.isFeatured || data.featuredRank, {
    path: ["featuredRank"],
    message: "Rank is required when business is featured",
  });

type FeatureBusinessFormValues = z.infer<typeof featureBusinessSchema>;

interface IFeatureBusinessDialog {
  business: Business;
  trigger?: React.ReactNode;
}

export const FeatureBusinessDialog: React.FC<IFeatureBusinessDialog> = ({
  business,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(featureBusinessSchema),
    defaultValues: {
      isFeatured: business.isFeatured ?? false,
      featuredRank: business.featuredRank ?? undefined,
      featuredEnd: business.featuredEnd
        ? new Date(business.featuredEnd)
        : undefined,
    },
  });

  const setFeaturedBusinessMutation = useAddFeaturedBusiness({
    resetForm: form.reset,
    onSuccess: () => {
      setOpen(false);
    },
    onError: (err: any) => {
      form.setError("root", {
        message: err?.message || "Something went wrong while saving.",
      });
    },
  });

  const onSubmit = (data: FeatureBusinessFormValues) => {
    const utcDate = data.featuredEnd
      ? TextHelper.toUTCISOString(data?.featuredEnd?.toLocaleDateString())
      : undefined;
    setFeaturedBusinessMutation.mutate({
      id: business.id,
      payload: {
        isFeatured: data.isFeatured,
        featuredRank: data.featuredRank,
        featuredEnd: utcDate,
      },
    });
  };

  const busy = setFeaturedBusinessMutation.isPending;

  const isFeatured = form.watch("isFeatured");

  React.useEffect(() => {
    if (!isFeatured) {
      form.setValue("featuredRank", undefined);
      form.setValue("featuredEnd", undefined);
    }
  }, [isFeatured]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="outline">Set as Featured</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Feature Business</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SwitchComponent
              formControl={form.control}
              formName="isFeatured"
              formLabel="Is Featured"
              description=""
              disabled={busy}
            />

            <InputComponent
              formControl={form.control}
              formName="featuredRank"
              formInputType="number"
              formLabel="Featured Rank"
              formPlaceholder="Enter rank"
              disabled={busy || !isFeatured}
            />

            <InputComponent
              formControl={form.control}
              formName="featuredEnd"
              formInputType="date"
              formLabel="Featured End Date"
              formPlaceholder=""
              disabled={busy || !isFeatured}
            />

            <DialogFooter>
              <DialogClose asChild>
                <BukkaButton>Cancel</BukkaButton>
              </DialogClose>

              <BukkaButton type="submit" disabled={busy || !isFeatured}>
                {busy ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </BukkaButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
