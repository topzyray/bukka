"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

/**
 * Input schema (matches actual form field types).
 * - price is a string in the input (we validate it's numeric if present).
 * - isActive is optional in inputs but we coerce defaults later.
 */
const schemaForInputs = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === "" || !Number.isNaN(Number(v)), {
      message: "Price must be a number",
    }),
  isActive: z.boolean().optional().default(true),
});

type FormInputs = z.infer<typeof schemaForInputs>;

/** Final model type (what backend expects). */
export type ServiceFormValues = {
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
};

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => void;
}

function mapInputsToValues(inputs: FormInputs): ServiceFormValues {
  const priceRaw = inputs.price;
  const price =
    priceRaw === undefined || priceRaw === "" ? undefined : Number(priceRaw);
  return {
    name: inputs.name,
    description: inputs.description,
    price,
    isActive: inputs.isActive ?? true,
  };
}

export function ServiceForm({
  open,
  onClose,
  initialData,
  onSubmit,
}: ServiceFormProps) {
  // defaultValues for the input-based form
  const defaultValues: FormInputs = {
    name: initialData?.name ?? "",
    description: initialData?.description ?? undefined,
    price:
      typeof initialData?.price === "number"
        ? String(initialData.price)
        : undefined,
    isActive: initialData?.isActive ?? true,
  };

  // ---- IMPORTANT: cast resolver to explicit Resolver<FormInputs> ----
  const form = useForm<FormInputs>({
    resolver: zodResolver(schemaForInputs) as unknown as Resolver<FormInputs>,
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      name: initialData?.name ?? "",
      description: initialData?.description ?? undefined,
      price:
        typeof initialData?.price === "number"
          ? String(initialData.price)
          : undefined,
      isActive: initialData?.isActive ?? true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    onSubmit(mapInputsToValues(data));
  };

  return (
    // <Dialog open={open} onOpenChange={onClose}>
    //   <DialogContent className="max-w-md">
    //     <DialogHeader>
    //       <DialogTitle>
    //         {initialData ? "Edit Service" : "Add Service"}
    //       </DialogTitle>
    //     </DialogHeader>

    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Service Name" {...form.register("name")} required />
      </div>

      <div>
        <Textarea placeholder="Description" {...form.register("description")} />
      </div>

      <div>
        <Input
          type="number"
          step="0.01"
          placeholder="Price (optional)"
          {...form.register("price")}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={!!form.watch("isActive")}
          onCheckedChange={(v) => form.setValue("isActive", !!v)}
        />
        <span>Active</span>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update" : "Create"}
      </Button>
    </form>
    //   </DialogContent>
    // </Dialog>
  );
}
