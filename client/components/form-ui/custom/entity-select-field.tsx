"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

type Data = Record<string, any>;

type Props = {
  control: Control<any>;
  formName: string;
  formLabel?: React.ReactNode;
  formData?: Data[];
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  icon?: React.ElementType;
  valueKey?: string;
  labelKey?: string;
};

export function SelectFieldCustom({
  control,
  formName,
  formLabel,
  formData = [],
  disabled = false,
  placeholder = "Select an option",
  inputClassName,
  icon: Icon,
  valueKey = "id",
  labelKey = "name",
}: Props) {
  return (
    <FormField
      control={control}
      name={formName}
      render={({ field, fieldState }) => {
        const currentVal = field.value ?? "";
        const selected = formData.find(
          (c) => String(c[valueKey]) === String(currentVal)
        );

        const isError = !!fieldState.error;
        const isValid =
          !isError &&
          (!!field.value ||
            (Array.isArray(field.value) && field.value.length > 0));

        return (
          <FormItem className="space-y-0.5">
            {formLabel && (
              <FormLabel
                className={cn(
                  "-mb-0.5",
                  isError && "text-red-600",
                  isValid && "text-green-600"
                )}
              >
                {formLabel}
              </FormLabel>
            )}

            <div className="relative">
              {Icon && (
                <Icon className="z-10 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}

              <Select
                value={String(currentVal ?? "")}
                onValueChange={(v: string) => {
                  const selectedOption = formData.find(
                    (c) => String(c[valueKey]) === v
                  );
                  field.onChange(
                    selectedOption ? selectedOption[valueKey] : ""
                  );
                }}
                disabled={disabled}
              >
                <FormControl>
                  <div>
                    <SelectTrigger
                      className={cn(
                        "w-full pr-8 flex flex-wrap gap-1",
                        "items-center py-2 px-3",
                        Icon && "pl-8",
                        "overflow-y-auto max-h-24 scrollbar-thin",
                        inputClassName,
                        isError && "border-red-600",
                        isValid && "border-green-600"
                      )}
                    >
                      {selected ? selected[labelKey] : placeholder}
                    </SelectTrigger>

                    <SelectContent>
                      {formData.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No options available
                        </div>
                      ) : (
                        formData.map((c) => (
                          <SelectItem
                            key={String(c[valueKey])}
                            value={String(c[valueKey])}
                          >
                            {c[labelKey]}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </div>
                </FormControl>
              </Select>

              {isError && (
                <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
              )}
              {isValid && (
                <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              )}
            </div>

            <FormMessage className="-mt-2 text-left" />
          </FormItem>
        );
      }}
    />
  );
}
