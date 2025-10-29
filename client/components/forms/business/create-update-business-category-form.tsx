"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateBusiness } from "@/server/mutations/business/use-business-mutation";
import { useBusinessCategories } from "@/server/queries/use-businesses-category-query";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { Form } from "../../ui/form";
import { InputComponent } from "../base/input-component";
import { SelectComponent } from "../base/select-component";
import { useCreateCategory } from "@/server/mutations/category/use-category-mutation";
import { TextAreaComponent } from "../base/text-area-component";
import { Business } from "@/server/interfaces/Business";

const schema = z.object({
  name: z.string().min(2, "Business name is required"),
  description: z.string().nullable().optional(),
  type: z.string().min(2, "Type of business is required."),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: Partial<Business>;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export function CreateUpdateBusinessCategoryModal({
  initial,
  mode = "create",
  trigger,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      type: initial?.type ?? "",
    },
  });

  const createMutation = useCreateCategory({ onSuccess });
  const updateMutation = useUpdateBusiness({
    onSuccess,
    resetForm: form.reset,
  });

  useEffect(() => {
    form.reset({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      type: initial?.type ?? "",
    });
  }, [initial, form]);

  const onSubmit = (data: FormValues) => {
    let payload: any;

    console.log("PAYLOAD: ", payload);

    if (isEdit && initial?.id) {
      payload = {
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        type: initial?.type ?? "",
      };
      updateMutation.mutate({ id: initial.id, payload });
    } else {
      payload = {
        name: data?.name,
        description: data?.description,
        type: data?.type,
      };
      createMutation.mutate(payload);
    }
  };

  const busy = createMutation.isPending || updateMutation.isPending;

  //   Note: Icon/cover inputs are simple URLs. If you want file upload integration, I can add a small uploader that uses your FileRepository endpoints.

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button>{isEdit ? "Edit" : "Add Category"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <ScrollArea className="max-h-[80vh] h-full w-full space-y-4">
              <div className="h-full w-full px-4 space-y-4">
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 gap-3">
                    <InputComponent
                      formControl={form.control}
                      formName="name"
                      formInputType="text"
                      formLabel="Name"
                      formPlaceholder="Restaurant"
                    />

                    <SelectComponent
                      formControl={form.control}
                      formName="type"
                      formLabel="Category"
                      formPlaceholder="Select category"
                      formOptionLabel="Select category"
                      formOptionData={[
                        { label: "RESTAURANT", value: "RESTAURANT" },
                        { label: "BAR", value: "BAR" },
                        { label: "LOUNGE", value: "LOUNGE" },
                        { label: "CATERING", value: "CATERING" },
                        { label: "BAKERY", value: "BAKERY" },
                        { label: "FOOD VENDOR", value: "FOOD_VENDOR" },
                        { label: "STREET EATRY", value: "STREET_EATRY" },
                        { label: "GROCERY", value: "GROCERY" },
                        {
                          label: "DELIVERY SERVICE",
                          value: "DELIVERY_SERVICE",
                        },
                        { label: "OTHER", value: "OTHER" },
                      ]}
                    />

                    <TextAreaComponent
                      formControl={form.control}
                      formName="description"
                      formPlaceholder="Short description about business category"
                      inputClassName="min-h-[120px]"
                    />
                  </div>

                  <DialogFooter>
                    <div className="flex gap-2 w-full">
                      <Button type="submit" className="flex-1" disabled={busy}>
                        {busy ? (
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : isEdit ? (
                          "Save changes"
                        ) : (
                          "Create category"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => form.reset()}
                        type="button"
                      >
                        Reset
                      </Button>
                    </div>
                  </DialogFooter>
                </div>
              </div>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
