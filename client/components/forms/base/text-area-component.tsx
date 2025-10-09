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
import { CheckCircle2, XCircle } from "lucide-react";

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
  icon?: React.ElementType;
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
  icon: Icon,
  ...props
}: ITextAreaComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error;
        const isValid = !isError && field.value?.length > 0;

        return (
          <FormItem className="flex flex-col space-y-1 w-full">
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

            <section className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-5 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}

              <FormControl>
                <Textarea
                  {...field}
                  placeholder={formPlaceholder}
                  disabled={disabled}
                  rows={rows}
                  className={cn(
                    "w-full resize-none overflow-y-auto",
                    Icon && "pl-8",
                    inputClassName,
                    isError &&
                      "border-[0.5px] border-red-600 focus-visible:ring-red-600 text-red-700",
                    isValid &&
                      "border-green-600 focus-visible:ring-green-600 text-green-700",
                    "pr-8 focus:outline-none focus:ring-1 focus:border-green-600"
                  )}
                  maxLength={maxLength}
                  {...props}
                />
              </FormControl>
              {/* Right validation icons */}
              {isError && (
                <XCircle className="absolute right-2 top-5 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
              )}
              {isValid && (
                <CheckCircle2 className="absolute right-2 top-5 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              )}
            </section>

            {formDescription && (
              <FormDescription className="-mt-3 text-xs resize-none text-muted-foreground">
                {formDescription}
              </FormDescription>
            )}

            <FormMessage className="-mt-3 text-left" />
          </FormItem>
        );
      }}
    />
  );
}
