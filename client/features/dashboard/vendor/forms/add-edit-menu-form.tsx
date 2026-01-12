"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useAuth } from "@/providers";
import { Form, SmartFileUploader } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Review } from "@/data/interfaces/Review";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { FileApiService } from "@/data/services";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
} from "@/data/enums";
import { Business } from "@/data/interfaces/Business";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface IAddEditReviewForm {
  isEdit: boolean;
  busy?: boolean;
  business: Business;
  initialData?: Partial<Review>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AddEditMenuForm({
  isEdit,
  busy,
  business,
  initialData,
  onSuccess,
  onClose,
}: IAddEditReviewForm) {
  const { user } = useAuth();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: initialData?.rating ?? 0,
      comment: initialData?.comment ?? "",
    },
  });

  // const createReview = useCreateReview({
  //   onSuccess: () => {
  //     onSuccess?.();
  //   },
  // });

  // const updateReview = useUpdateReview({
  //   onSuccess: () => {
  //     onSuccess?.();
  //     queryClient.invalidateQueries({ queryKey: ["business", businessId] });
  //   },
  // });

  useEffect(() => {
    if (initialData) {
      form.reset({
        rating: initialData?.rating ?? 0,
        comment: initialData?.comment ?? "",
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: ReviewFormValues) => {
    // if (isEdit && initialData?.id) {
    //   updateReview.mutate({
    //     ...data,
    //     businessId,
    //     reviewId: initialData.id,
    //     userId: user?.id as number,
    //   });
    // } else {
    //   createReview.mutate({
    //     ...data,
    //     businessId,
    //     userId: user?.id as number,
    //   });
    // }
  };

  // busy = createReview.isPending || updateReview.isPending;
  busy = false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <SmartFileUploader
            title="Add Business Images"
            isMultiple
            uploadFn={FileApiService.uploadFile}
            maxFiles={2}
            extraParams={{
              referenceType: FileReferenceTypeEnum.BUSINESS,
              category: FileCategoryEnum.BUSINESS_IMAGES,
              referenceId: business?.id,
              isPublic: true,
              metadata: {
                altText: `${business?.name} - images`,
              },
            }}
            onUploadSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnum.BUSINESS_FILES, business?.id],
              });
            }}
          />

          <InputComponent
            formControl={form.control}
            formName="name"
            formLabel="Name"
            formInputType="text"
            formPlaceholder="Enter menu name"
            disabled={busy}
          />

          <InputComponent
            formControl={form.control}
            formName="price"
            formLabel="Price"
            formInputType="number"
            formPlaceholder="Enter menu price"
            disabled={busy}
          />

          <div className="flex justify-end gap-2 w-full">
            <Button
              size="sm"
              type="submit"
              disabled={busy || !form.formState.isValid}
            >
              {busy ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Submit Review"
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => form.reset()}
              type="button"
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onClose?.()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
