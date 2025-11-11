"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Edit, Info, Loader2, Star, X } from "lucide-react";
import { BukkaButton, Button, Separator, Textarea } from "@/components/ui";
import { Review } from "@/data/interfaces/Review";
import { Card, CardContent } from "@/components/ui/card";
import { AddEditReviewForm } from "../forms/add-review-form";
import { useInfiniteReviewsQuery } from "@/data/queries/use-reviews";
import { TextHelper } from "@/helpers";
import { useAuth } from "@/providers";
import { toast } from "sonner";
import { Business } from "@/data/interfaces/Business";
import { useQueryClient } from "@tanstack/react-query";

export function BusinessReviews({ business }: { business: Business }) {
  const PAGE_SIZE = 10;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showUpdateReviewForm, setShowUpdateReviewForm] = useState<{
    reviewId: null | number;
    show: boolean;
  }>({ reviewId: null, show: false });

  const [isNewReview, setIsNewReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    undefined
  );

  const filterObj = useMemo(
    () => ({ rating: selectedRating }), // always generate a new object
    [selectedRating]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteReviewsQuery({
    businessId: business.id,
    filters: filterObj,
    pageSize: PAGE_SIZE,
    enabled: !!business.id, // explicitly enabled
  });

  const reviews: Review[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  const businessOwnerId = business.ownerId;
  const isVendor = user?.id === businessOwnerId;

  const alreadyMadeReview = useMemo(() => {
    if (!user?.id) return null;
    return reviews.find((r) => r.userId === user.id) ?? null;
  }, [reviews, user?.id]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["business-reviews", business.id] });
    // window.scrollTo({ top: 0 });
    refetch();
  }, [business.id, selectedRating, refetch, queryClient]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const el = observerRef.current;
    observer.observe(el);

    return () => observer.unobserve(el);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load reviews", {
        description: "Please check your connection or try again later.",
      });
    }
  }, [isError]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-2 rounded-md">
        <span className="text-sm font-medium text-gray-700">
          Filter by rating:
        </span>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            className={`relative flex items-center gap-1 px-2 py-1 rounded-md transition hover:cursor-pointer
        ${
          selectedRating === star
            ? "bg-yellow-100 text-yellow-600"
            : "hover:bg-gray-100 text-gray-600"
        }`}
            title={`Show ${star}-star reviews`} // tooltip on hover
          >
            <Star
              size={16}
              className={`transition-transform duration-200 ${
                selectedRating === star
                  ? "fill-yellow-500 text-yellow-500 scale-110"
                  : "text-gray-400 hover:scale-110"
              }`}
            />
            <span className="text-sm font-semibold">{star}</span>
          </button>
        ))}

        {selectedRating && (
          <button
            type="button"
            onClick={() => setSelectedRating(undefined)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 bg-red-50 rounded-md hover:bg-red-100 transition hover:cursor-pointer"
            title="Reset rating filter"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            Loading reviews...
          </span>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: Review) => {
            const isUserReview = user?.id === review.userId;

            return (
              <Fragment key={review.id}>
                {showUpdateReviewForm.show &&
                showUpdateReviewForm.reviewId === review.id ? (
                  <AddEditReviewForm
                    isEdit
                    initialData={
                      reviews.find(
                        (r) => r.id === showUpdateReviewForm.reviewId
                      ) ?? undefined
                    }
                    businessId={business.id}
                    onClose={() =>
                      setShowUpdateReviewForm({ reviewId: null, show: false })
                    }
                    onSuccess={() =>
                      setShowUpdateReviewForm({ reviewId: null, show: false })
                    }
                  />
                ) : (
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
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
                              {TextHelper.smartTimeAgo(
                                new Date(review.createdAt)
                              )}
                            </span>
                          </div>

                          {review.user && (
                            <div className="flex items-center gap-1.5">
                              <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 warm-gradient flex justify-center items-center">
                                <span className="font-bold text-border text-sm sm:text-base">
                                  {review.user.firstName[0]}
                                  {review.user.lastName[0]}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-right">
                                {review.user.firstName} {review.user.lastName}
                              </div>
                            </div>
                          )}
                        </div>

                        {review.comment && (
                          <p className="text-muted-foreground text-sm leading-snug text-justify">
                            {review.comment}
                          </p>
                        )}
                      </div>

                      {isUserReview && !showUpdateReviewForm.show && (
                        <div className="text-end">
                          <BukkaButton
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShowUpdateReviewForm({
                                show: true,
                                reviewId: review.id,
                              })
                            }
                            className="py-1 text-xs"
                          >
                            <Edit className="h-4 w-4" />
                            Edit My Review
                          </BukkaButton>
                        </div>
                      )}

                      {isVendor && (
                        <>
                          <Separator />
                          <div>
                            <div className="mt-2 text-sm">
                              <span className="text-sm font-medium text-left">
                                Vendor reply:
                              </span>{" "}
                              <span className="text-muted-foreground text-sm leading-snug">
                                {review?.reply || "No reply yet."}
                              </span>
                            </div>

                            <div className="w-1/2 mt-2">
                              <Textarea placeholder="Reply..." />
                              <div className="mt-2">
                                <Button size="sm">Reply</Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Fragment>
            );
          })}

          {/* Observer for infinite scroll */}
          <div ref={observerRef} />
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews found.</p>
      )}

      {/* ADD REVIEW BUTTON */}
      {!isVendor && !alreadyMadeReview && !isNewReview && (
        <BukkaButton
          size="sm"
          onClick={() => {
            if (!user) {
              toast("Requires sign in!", {
                icon: <Info className="h-3 w-3" />,
                description: "Please sign in to add review",
              });
              return;
            }
            setIsNewReview(true);
          }}
        >
          Add Review
        </BukkaButton>
      )}

      {isNewReview && (
        <AddEditReviewForm
          isEdit={false}
          initialData={undefined}
          businessId={business.id}
          onClose={() => setIsNewReview(false)}
          onSuccess={() => setIsNewReview(false)}
        />
      )}
    </div>
  );
}
