"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Form } from "../../../../components/ui/form";
import { SelectComponent } from "../../../../components/form-ui/base/select-component";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/data/mutations/category/use-category-mutation";
import { TextAreaComponent } from "../../../../components/form-ui/base/text-area-component";
import { TextHelper } from "@/helpers";
import { BusinessTypeEnum } from "@/data/enums/BusinessTypeEnum";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";

const catgorySchema = z.object({
  description: z.string().nullable().optional(),
  type: z.string().min(2, "Type of business is required."),
});

export type CategoryFormValues = z.infer<typeof catgorySchema>;

interface ICreateEditCategoryForm {
  isEdit: boolean;
  busy?: boolean;
  initialData?: Partial<BusinessCategory>;
  onSuccess?: () => void;
}

export function CreateEditCategoryForm({
  isEdit,
  busy,
  initialData,
  onSuccess,
}: ICreateEditCategoryForm) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(catgorySchema),
    mode: "onChange",
    defaultValues: {
      description: initialData?.description ?? "",
      type: initialData?.type ?? "",
    },
  });

  const createMutation = useCreateCategory({
    onSuccess,
    resetForm: form.reset,
  });
  const updateMutation = useUpdateCategory({
    onSuccess,
  });

  useEffect(() => {
    form.reset({
      description: initialData?.description ?? "",
      type: initialData?.type ?? "",
    });
  }, [initialData, form]);

  const onSubmit = (data: CategoryFormValues) => {
    let payload = {
      name: TextHelper.capitalizeWords(
        TextHelper.normalizeText(data.type.toLowerCase())
      ),
      description: data?.description ?? "",
      type: data?.type as BusinessTypeEnum,
    };

    if (isEdit && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  busy = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <ScrollArea className="max-h-[80vh] h-full w-full space-y-4">
          <div className="h-full w-full px-4 space-y-4">
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 gap-3">
                <SelectComponent
                  formControl={form.control}
                  formName="type"
                  formLabel="Category"
                  formPlaceholder="Select category"
                  formOptionLabel="Select category"
                  formOptionData={[
                    {
                      label: BusinessTypeEnum.RESTAURANT,
                      value: BusinessTypeEnum.RESTAURANT,
                    },
                    {
                      label: BusinessTypeEnum.BAR,
                      value: BusinessTypeEnum.BAR,
                    },
                    {
                      label: BusinessTypeEnum.LOUNGE,
                      value: BusinessTypeEnum.LOUNGE,
                    },
                    {
                      label: BusinessTypeEnum.CATERING,
                      value: BusinessTypeEnum.CATERING,
                    },
                    {
                      label: BusinessTypeEnum.BAKERY,
                      value: BusinessTypeEnum.BAKERY,
                    },
                    {
                      label: "FOOD VENDOR",
                      value: BusinessTypeEnum.FOOD_VENDOR,
                    },
                    {
                      label: "FAST FOOD",
                      value: BusinessTypeEnum.FAST_FOOD,
                    },
                    {
                      label: "STREET EATRY",
                      value: BusinessTypeEnum.STREET_EATRY,
                    },
                    {
                      label: BusinessTypeEnum.GROCERY,
                      value: BusinessTypeEnum.GROCERY,
                    },
                    {
                      label: "DELIVERY SERVICE",
                      value: BusinessTypeEnum.DELIVERY_SERVICE,
                    },
                    {
                      label: BusinessTypeEnum.OTHER,
                      value: BusinessTypeEnum.OTHER,
                    },
                  ]}
                  disabled={isEdit}
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
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={busy || !form.formState.isValid}
                  >
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
  );
}
