"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ISelectComponentProps {
  formControl: any;
  formName: string;
  formLabel?: ReactNode;
  formPlaceholder?: string;
  formOptionLabel: string;
  formOptionData: Record<string, string>[];
  disabled?: boolean;
  inputClassName?: string;
  icon?: React.ElementType; // Left icon support
  multiSelect?: boolean; // NEW: enables multi-select
}

export function SelectComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formOptionLabel,
  formOptionData,
  disabled,
  inputClassName,
  icon: Icon,
  multiSelect = false, // default is false for backward compatibility
}: ISelectComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error;
        const isValid =
          !isError &&
          (!!field.value ||
            (Array.isArray(field.value) && field.value.length > 0));

        // Handle multi-select changes
        // const handleSelectChange = (value: string) => {
        //   if (multiSelect) {
        //     const currentValues: string[] = field.value || [];
        //     if (currentValues.includes(value)) {
        //       field.onChange(currentValues.filter((v) => v !== value));
        //     } else {
        //       field.onChange([...currentValues, value]);
        //     }
        //   } else {
        //     field.onChange(value);
        //   }
        // };

        return (
          <FormItem className="space-y-0.5">
            {/* Label */}
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

            <div className="relative  flex items-center">
              {Icon && (
                <Icon className="z-10 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}

              <Select
                key={field.value ?? "empty"}
                onValueChange={(value: string) => {
                  if (multiSelect) {
                    const current: string[] = Array.isArray(field.value)
                      ? field.value
                      : [];
                    if (current.includes(value)) {
                      field.onChange(current.filter((v) => v !== value));
                    } else {
                      field.onChange([...current, value]);
                    }
                  } else {
                    field.onChange(value);
                  }
                }}
                value={
                  multiSelect && Array.isArray(field.value)
                    ? undefined
                    : field.value ?? ""
                }
                disabled={disabled}
              >
                <FormControl>
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
                    {multiSelect &&
                    Array.isArray(field.value) &&
                    field.value.length > 0 ? (
                      // ✅ Multi-select view: render badges
                      <div className="flex flex-wrap gap-1">
                        {field.value.map((val: string) => (
                          <span
                            key={val}
                            className="text-xs bg-accent text-accent-foreground rounded-md px-2 py-0.5"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    ) : !multiSelect && field.value ? (
                      // ✅ Single-select view: show selected label
                      <span className="text-foreground text-sm">
                        {field.value}
                      </span>
                    ) : (
                      // ✅ Default fallback: show placeholder
                      <span className="text-muted-foreground text-sm">
                        {formPlaceholder}
                      </span>
                    )}
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{formOptionLabel}</SelectLabel>
                    {formOptionData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
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
