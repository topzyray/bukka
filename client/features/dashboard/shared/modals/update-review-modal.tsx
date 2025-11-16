"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Review } from "@/data/interfaces/Review";
import { Separator } from "@/components/ui/separator";
import { AddEditReviewForm } from "@/features/business/forms/add-edit-review-form";

interface IUpdateReviewModal {
  open?: boolean;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  initialData?: Partial<Review>;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function UpdateReviewModal({
  open,
  mode = "create",
  trigger,
  initialData,
  onSuccess,
  onOpenChange,
}: IUpdateReviewModal) {
  const isEdit = mode === "edit";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>

        <Separator />

        {initialData && (
          <AddEditReviewForm
            isEdit={isEdit}
            businessId={initialData.businessId as number}
            initialData={initialData}
            onClose={onSuccess}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
