"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Business } from "@/server/interfaces/Business";
import { Separator } from "@/components/ui/separator";
import { CreateEditBusinessForm } from "./component/create-edit-business-form";

type Props = {
  initial?: Partial<Business>;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export function CreateUpdateBusinessModal({
  initial,
  mode = "create",
  trigger,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>{isEdit ? "Edit Business" : "Add Business"}</Button>
        )}
      </DialogTrigger>

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
          initial={initial}
          scrollAreaClassName="max-h-[75vh] h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
