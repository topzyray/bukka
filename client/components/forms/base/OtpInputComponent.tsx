import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import { ReactNode } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface IOtpInputComponentProps {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  disabled?: boolean;
  length?: number;
  autoFocus?: boolean;
  description?: string;
}

export default function OtpInputComponent({
  formControl,
  formName,
  formLabel,
  disabled = false,
  length = 6,
  autoFocus = false,
  description,
}: IOtpInputComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => {
        const currentValue = field.value || "";

        return (
          <FormItem>
            <FormLabel className="text-lg">{formLabel}</FormLabel>
            <FormControl>
              <InputOTP
                maxLength={length}
                {...field}
                value={currentValue}
                disabled={disabled}
                autoFocus={autoFocus}
              >
                <InputOTPGroup className="w-full">
                  {Array.from({ length }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="w-1/6" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>

            {/* Optional description */}
            {description && currentValue?.length < length && (
              <FormDescription>{description}</FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
