"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useAuth } from "@/providers";
import { Form } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Review } from "@/data/interfaces/Review";
import {
  useCreateReview,
  useUpdateReview,
} from "@/data/mutations/review/use-review-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RatingComponent } from "@/components/form-ui/custom/rating-comonent";
import { TextAreaComponent } from "@/components/form-ui/base/text-area-component";
import { useQueryClient } from "@tanstack/react-query";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface IAddEditReviewForm {
  isEdit: boolean;
  busy?: boolean;
  businessId: number;
  initialData?: Partial<Review>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AddEditReviewForm({
  isEdit,
  busy,
  businessId,
  initialData,
  onSuccess,
  onClose,
}: IAddEditReviewForm) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: initialData?.rating ?? 0,
      comment: initialData?.comment ?? "",
    },
  });

  const createReview = useCreateReview({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const updateReview = useUpdateReview({
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        rating: initialData?.rating ?? 0,
        comment: initialData?.comment ?? "",
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: ReviewFormValues) => {
    if (isEdit && initialData?.id) {
      updateReview.mutate({
        ...data,
        businessId,
        reviewId: initialData.id,
        userId: user?.id as number,
      });
    } else {
      createReview.mutate({
        ...data,
        businessId,
        userId: user?.id as number,
      });
    }
  };

  busy = createReview.isPending || updateReview.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 py-2"
      >
        <div className="space-y-4 mt-2">
          <RatingComponent
            formControl={form.control}
            formName="rating"
            formLabel="Rating"
            disabled={busy}
          />

          <TextAreaComponent
            formControl={form.control}
            formName="comment"
            rows={5}
            disabled={busy}
            formPlaceholder="Write your review about this business..."
            inputClassName="min-h-[60px]"
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
