"use client";

import { Loader2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessReviews } from "@/data/queries/use-reviews";
import { Review } from "@/data/interfaces/Review";
import { BukkaButton } from "@/components/ui";

export function BusinessReviews({ businessId }: { businessId: number }) {
  const { data, isLoading } = useBusinessReviews({
    businessId,
  });

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center py-10">
  //       <Loader2 className="animate-spin" />
  //     </div>
  //   );

  // if (!data?.length) return;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : data && data?.length ? (
        <div className="space-y-4">
          {data.map((review: Review) => (
            <Card key={review?.id}>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-semibold">{review?.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    • {review?.user?.firstName}
                  </span>
                </div>
                <p className="text-muted-foreground">{review?.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data?.length ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        ""
      )}

      <div>
        <BukkaButton>Add Review</BukkaButton>
      </div>
    </div>
  );
}
