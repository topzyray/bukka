"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Business } from "@/data/interfaces/Business";
import { Separator } from "@/components/ui/separator";
import { CreateEditBusinessForm } from "../forms/create-edit-business-form";

interface ICreateUpdateBusinessModal {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<Business>;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateUpdateBusinessModal({
  open,
  onOpenChange,
  initialData,
  mode = "create",
  trigger,
  onSuccess,
}: ICreateUpdateBusinessModal) {
  const isEdit = mode === "edit";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[720px] rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Business" : "Create Business"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <CreateEditBusinessForm
          onSuccess={onSuccess}
          isEdit={isEdit}
          initialData={initialData}
          scrollAreaClassName="max-h-[75vh] h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
