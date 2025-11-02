"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";
import { Separator } from "@/components/ui/separator";
import { CreateEditCategoryForm } from "../forms/create-edit-category-form";

interface ICreateUpdateCategoryModal {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<BusinessCategory>;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateUpdateCategoryModal({
  open,
  onOpenChange,
  initialData,
  mode = "create",
  trigger,
  onSuccess,
}: ICreateUpdateCategoryModal) {
  const isEdit = mode === "edit";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <CreateEditCategoryForm
          onSuccess={onSuccess}
          isEdit={isEdit}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
