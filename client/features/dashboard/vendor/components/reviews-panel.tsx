"use client";

import React from "react";
import { Button, Input } from "@/components/ui";
import { useBusinessReviews } from "@/data/queries/use-reviews";
import { useReplyReview } from "@/data/mutations/review/use-reply-review";

export const ReviewsPanel: React.FC<{ businessId: number }> = ({
  businessId,
}) => {
  const { data } = useBusinessReviews({ businessId });

  const replyMutation = useReplyReview();

  const [replies, setReplies] = React.useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {data?.map((r: any) => (
        <div key={r.id} className="border p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{r.userName}</div>
              <div className="text-sm text-muted-foreground">
                {r.rating} • {new Date(r.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-2">{r.text}</div>
              {r.reply && (
                <div className="mt-2 text-sm text-primary">
                  Vendor reply: {r.reply}
                </div>
              )}
            </div>

            <div className="w-48">
              <Input
                placeholder="Reply..."
                value={replies[r.id] ?? ""}
                onChange={(e) =>
                  setReplies((s) => ({ ...s, [r.id]: e.target.value }))
                }
              />
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={() =>
                    replyMutation.mutate({
                      businessId,
                      rating: 0,
                      userId: 1,
                    })
                  }
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
