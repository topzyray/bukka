import { ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ITextAreaComponentProps = {
  formControl: any;
  formName: string;
  formLabel?: ReactNode;
  formPlaceholder?: string;
  formDescription?: string;
  rows?: number;
  disabled?: boolean;
  inputClassName?: string;
  maxLength?: number;
};

export default function TextAreaComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  rows = 10,
  disabled = false,
  inputClassName,
  maxLength,
}: ITextAreaComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-1 w-full">
          {formLabel && <FormLabel>{formLabel}</FormLabel>}

          <FormControl>
            <Textarea
              {...field}
              placeholder={formPlaceholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "w-full resize-none overflow-y-auto",
                inputClassName
              )}
              maxLength={maxLength}
            />
          </FormControl>

          {formDescription && (
            <FormDescription className="text-xs resize-none text-muted-foreground">
              {formDescription}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
