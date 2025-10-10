import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { ReactNode, useState } from "react";
import { EyeIcon, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { TextHelper } from "@/helpers/text-helper";
import { cn } from "@/lib/utils";

interface IInputComponentProps {
  formControl: any;
  formName: string;
  formLabel?: ReactNode;
  formInputType: string;
  formPlaceholder?: string;
  isPassword?: boolean;
  formMaxYear?: string;
  formMinYear?: string;
  editable?: boolean;
  disabled?: boolean;
  showPasswordStrength?: boolean;
  inputClassName?: string;
  icon?: React.ElementType;
}

export default function InputComponent({
  formControl,
  formName,
  formLabel,
  formInputType,
  formPlaceholder,
  isPassword,
  formMaxYear,
  formMinYear,
  editable,
  disabled,
  showPasswordStrength = true,
  inputClassName,
  icon: Icon,
  ...props
}: IInputComponentProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error;
        const isValid = !isError && field.value?.length > 0;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;
          if (formInputType === "date") {
            const utcValue = TextHelper.dateInputToUTC(rawValue);
            field.onChange(utcValue);
          } else {
            field.onChange(rawValue);
          }
        };

        const passwordStrength =
          isPassword && field.value
            ? TextHelper.getPasswordStrength(field.value)
            : null;

        return (
          <FormItem className="space-y-0.5">
            {/* Label */}
            {formLabel && (
              <FormLabel
                className={cn(
                  "-mb-0.5",
                  isError && "text-red-600",
                  isValid && "text-green-600",
                  isPassword && "flex items-center justify-between"
                )}
              >
                {formLabel}
                {isPassword && (
                  <span className="cursor-pointer">
                    {visible ? (
                      <EyeOff size={20} onClick={() => setVisible(false)} />
                    ) : (
                      <EyeIcon size={20} onClick={() => setVisible(true)} />
                    )}
                  </span>
                )}
              </FormLabel>
            )}

            {/* Input with icons */}
            <section className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}

              <FormControl>
                <Input
                  disabled={disabled}
                  type={isPassword && visible ? "text" : formInputType}
                  placeholder={formPlaceholder}
                  max={formMaxYear}
                  min={formMinYear}
                  readOnly={editable}
                  {...field}
                  onChange={handleChange}
                  value={
                    formInputType === "date" && field.value
                      ? String(field.value).slice(0, 10)
                      : field.value ?? ""
                  }
                  className={cn(
                    Icon && "pl-8",
                    inputClassName,
                    isError &&
                      "border-red-600 focus-visible:ring-red-600 text-red-700",
                    isValid &&
                      "border-green-600 focus-visible:ring-green-600 text-green-700",
                    "pr-8 focus:outline-none focus:ring-0 focus:border-none"
                  )}
                  {...props}
                />
              </FormControl>

              {/* Right validation icons */}
              {isError && (
                <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
              )}
              {isValid && (
                <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              )}
            </section>

            {/* Password strength meter */}
            {isPassword &&
              passwordStrength &&
              showPasswordStrength &&
              !isError && (
                <p
                  className={cn(
                    "text-sm",
                    passwordStrength === "Weak" && "text-red-600",
                    passwordStrength === "Medium" && "text-yellow-600",
                    passwordStrength === "Strong" && "text-green-600"
                  )}
                >
                  Password strength: {passwordStrength}
                </p>
              )}

            <FormMessage className="-mt-2 text-left" />
          </FormItem>
        );
      }}
    />
  );
}
