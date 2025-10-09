import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
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
}

export default function SelectComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formOptionLabel,
  formOptionData,
  disabled,
  inputClassName,
  icon: Icon,
}: ISelectComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error;
        const isValid = !isError && !!field.value;

        return (
          <FormItem className="space-y-0.5">
            {/* Label with dynamic color */}
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-full pr-8",
                      Icon && "pl-8",
                      inputClassName,
                      isError &&
                        "border-red-600 focus:border-red-600 focus:ring-0",
                      isValid &&
                        "border-green-600 focus:border-green-600 focus:ring-0",
                      "focus:outline-none"
                    )}
                  >
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    )}
                    <SelectValue placeholder={formPlaceholder} />
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
