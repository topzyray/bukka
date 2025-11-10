"use client";

import { useMemo, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { BukkaButton } from "@/components/ui";
import { Review } from "@/data/interfaces/Review";
import { Card, CardContent } from "@/components/ui/card";
import { AddEditReviewForm } from "../forms/add-review-form";
import { useBusinessReviews } from "@/data/queries/use-reviews";
import { TextHelper } from "@/helpers";
import { useAuth } from "@/providers";

export function BusinessReviews({ businessId }: { businessId: number }) {
  const { user } = useAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data, isLoading } = useBusinessReviews({
    businessId,
  });
  const reviews = useMemo(() => {
    return data?.responseData?.data ?? [];
  }, [data?.responseData?.data]);

  const alreadyMadeReview = useMemo(() => {
    if (!user?.id) return null;
    return reviews.find((r) => r.userId === user.id) ?? null;
  }, [reviews, user?.id]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: Review) => (
            <Card key={review.id}>
              <CardContent className="py-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground">
                      {TextHelper.smartTimeAgo(new Date(review.createdAt))}
                    </span>
                  </div>

                  {review.user && (
                    <div className="text-sm font-medium text-right">
                      {review.user.firstName} {review.user.lastName}
                    </div>
                  )}
                </div>

                {review.comment && (
                  <p className="text-muted-foreground text-sm leading-snug">
                    {review.comment}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet.</p>
      )}

      <div>
        {!alreadyMadeReview && !showReviewForm && (
          <BukkaButton size="sm" onClick={() => setShowReviewForm(true)}>
            Add Review
          </BukkaButton>
        )}

        {alreadyMadeReview && !showReviewForm && (
          <BukkaButton
            size="sm"
            variant="outline"
            onClick={() => setShowReviewForm(true)}
          >
            Edit My Review
          </BukkaButton>
        )}

        {showReviewForm && (
          <AddEditReviewForm
            isEdit={!!alreadyMadeReview}
            initialData={alreadyMadeReview ?? undefined}
            businessId={businessId}
            onClose={() => setShowReviewForm(false)}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}
      </div>
    </div>
  );
}
