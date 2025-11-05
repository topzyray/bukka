import { useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface IPhoneNumberInputProps {
  formControl: any;
  formName: string;
  formLabel?: string;
  disabled?: boolean;
  autoDetect?: boolean;
  inputClassName?: string;
  icon?: React.ElementType;
  withKey?: boolean;
}

export function PhoneNumberInput({
  formControl,
  formName,
  formLabel,
  disabled,
  autoDetect = false,
  inputClassName,
  icon: Icon,
  withKey = false,
}: IPhoneNumberInputProps) {
  const { formState } = formControl;

  const errors = formState.errors as Record<string, FieldError | undefined>;

  const [defaultCountry, setDefaultCountry] = useState("ng");

  useEffect(() => {
    if (!autoDetect) return;

    let cancelled = false;

    // Try to get country from locale
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const countryCode = locale.split("-")[1]?.toLowerCase();
      if (!cancelled && countryCode) setDefaultCountry(countryCode);
    } catch (err) {
      console.warn("Locale detection failed:", err);
    }

    // Fallback to IP lookup
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        if (!cancelled && res.data?.country_code) {
          setDefaultCountry(res.data.country_code.toLowerCase());
        }
      })
      .catch(() => {
        console.log("IP lookup failed, fallback to locale");
      });

    return () => {
      cancelled = true;
    };
  }, [autoDetect]);

  return (
    <FormField
      control={formControl.control}
      name={formName}
      render={({ field }) => {
        const isError = !!errors[formName as string]?.message;
        const isValid = !isError && field.value?.length > 0;

        return (
          <FormItem className="space-y-1">
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
            <section className="relative  flex items-center">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <FormControl>
                <PhoneInput
                  key={(withKey && field.value) || ""}
                  country={defaultCountry}
                  enableSearch
                  value={field.value || ""}
                  onChange={(val) => {
                    if (!val) {
                      field.onChange("");
                      return;
                    }
                    try {
                      const phoneNumber = parsePhoneNumberFromString("+" + val);
                      const normalized = phoneNumber
                        ? phoneNumber.format("E.164")
                        : "+" + val;
                      field.onChange(normalized);
                    } catch {
                      field.onChange("+" + val);
                    }
                  }}
                  onBlur={field.onBlur} // important for RHF validation
                  disabled={disabled}
                  containerClass={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-primary/50 focus-visible:ring-[1px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    isError &&
                      "border-red-600 focus-visible:ring-red-600 text-red-700",
                    isValid &&
                      "border-green-600 focus-visible:ring-green-600 text-green-700",
                    "pr-8 focus:outline-none focus:ring-0 focus:border-none",
                    inputClassName
                  )}
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                    paddingTop: 4,
                    paddingBottom: 4,
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                  }}
                  searchStyle={{
                    padding: "8px",
                    width: "90%",
                  }}
                  searchPlaceholder="Search"
                  dropdownStyle={{
                    maxWidth: "280px",
                    width: "280px",
                    margin: "0",
                    textAlign: "left",
                  }}
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
            {isError && (
              <FormMessage className="-mt-2 text-left">
                {errors[formName as string]?.message}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
}
