"use client";

import Link from "next/link";
import { useAuth } from "@/providers";
import { useEffect, useMemo, useState } from "react";
import {
  BukkaButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { usePathname } from "next/navigation";
import { Review } from "@/data/interfaces/Review";
import { RouteHelper, TextHelper } from "@/helpers";
import { Star, Loader2, Edit, X } from "lucide-react";
import { queryClient } from "@/lib";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { UpdateReviewModal } from "./modals/update-review-modal";
import { useUserAllReviewsQuery } from "@/data/queries/use-reviews";
import { QueryKeyEnum } from "@/data/enums";

export function UserReviewsList() {
  const PAGE_SIZE = 10;
  const { user } = useAuth();

  const pathname = usePathname();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      ...(selectedRating ? { rating: selectedRating } : {}),
    }),
    [filters, selectedRating]
  );

  const { data, isLoading, isError, refetch } = useUserAllReviewsQuery({
    userId: user?.id as number,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    filters: effectiveFilters,
    enabled: !!user?.id,
  });

  const reviews = data?.responseData?.data ?? [];
  const total = data?.responseData?.total ?? 0;

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn,
      total,
      pageSize: PAGE_SIZE,
      queryClient,
      queryKey: [QueryKeyEnum.USER_REVIEWS],
      setPage,
    });
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setReviewToEdit(null);
  };

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: [QueryKeyEnum.USER_REVIEWS, user?.id],
    });
    refetch();
  }, [user?.id, selectedRating, refetch, queryClient]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="text-muted-foreground text-sm">
          View and manage all reviews you’ve written
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-gray-50 p-2 rounded-md">
        <span className="text-sm font-medium text-gray-700">
          Filter by rating:
        </span>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition hover:cursor-pointer ${
              selectedRating === star
                ? "bg-yellow-100 text-yellow-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Star
              size={16}
              className={`${
                selectedRating === star
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400"
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
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin mr-2" />
          Loading your reviews...
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load reviews. Try again later.</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No reviews yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven’t reviewed any businesses yet or no filter matched.
          </p>
          <BukkaButton asChild>
            <Link href="/businesses">Explore Businesses</Link>
          </BukkaButton>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: Review) => {
            let businessDetailsLink: string = RouteHelper.businessDetailsLink(
              pathname,
              user?.role as string,
              review?.businessId
            );

            return (
              <Card key={review?.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review?.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {TextHelper.smartTimeAgo(new Date(review?.createdAt))}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {review?.comment}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={businessDetailsLink}
                      className="text-primary dark:text-foreground font-medium hover:underline text-base"
                    >
                      {review?.business?.name}
                    </Link>

                    <BukkaButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditReview(review)}
                      className="py-1 text-xs"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </BukkaButton>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-2">
            {Array.from({
              length: Math.ceil(total / PAGE_SIZE),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <UpdateReviewModal
        mode="edit"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={reviewToEdit as Review}
        onSuccess={() => {
          handleModalClose();
        }}
      />
    </section>
  );
}
