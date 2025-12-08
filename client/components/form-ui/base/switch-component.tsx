import { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface ISwitchComponentProps {
  formControl: any;
  formName: string;
  formLabel?: ReactNode;
  disabled?: boolean;
  description?: string;
  icon?: React.ElementType;
  containerClassName?: string;
}

export function SwitchComponent({
  formControl,
  formName,
  formLabel,
  disabled,
  description,
  icon: Icon,
  containerClassName,
}: ISwitchComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error;
        const isValid = !isError && field.value !== undefined;

        return (
          <FormItem className={cn("space-y-0.5", containerClassName)}>
            {/* Label */}
            {formLabel && (
              <FormLabel
                className={cn(
                  "-mb-0.5 flex items-center gap-2"
                  // isError && "text-red-600 dark:text-red-400",
                  // isValid && "text-green-600"
                )}
              >
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                {formLabel}
              </FormLabel>
            )}

            <section className="relative flex items-center gap-3">
              {/* Switch */}
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className="dark:border-muted-foreground"
                  // className={cn(
                  //   isError &&
                  //     "data-[state=checked]:bg-red-600 data-[state=unchecked]:border-red-600",
                  //   isValid &&
                  //     "data-[state=checked]:bg-green-600 data-[state=unchecked]:border-green-600"
                  // )}
                />
              </FormControl>

              {/* Right validation icons */}
              {/* {isError && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )} */}

              {/* {isValid && <CheckCircle2 className="w-5 h-5 text-green-600" />} */}
            </section>

            {/* Description */}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}

            <FormMessage className="-mt-1 text-left dark:text-red-400" />
          </FormItem>
        );
      }}
    />
  );
}
