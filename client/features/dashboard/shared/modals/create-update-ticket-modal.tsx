"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Support } from "@/data/interfaces/Support";
import { CreateEditTicketForm } from "@/features/shared/form/create-edit-ticket-form";
import { User } from "@/data/interfaces/User";
import { ScrollArea } from "@/components/ui";

interface ICreateUpdateCategoryModal {
  open?: boolean;
  user?: User | null;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  initialData?: Partial<Support>;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function CreateUpdateTicketModal({
  open,
  user,
  mode = "create",
  trigger,
  initialData,
  onSuccess,
  onOpenChange,
}: ICreateUpdateCategoryModal) {
  const isEdit = mode === "edit";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh]">
          <CreateEditTicketForm
            onSuccess={onSuccess}
            isEdit={isEdit}
            initialData={initialData}
            user={user}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
