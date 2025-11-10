import { ReactNode } from "react";
import { Star } from "lucide-react";
import { FormControl, FormField, FormLabel } from "@/components/ui";

type IRatingComponent = {
  formControl: any;
  formName: string;
  formLabel?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
};

export function RatingComponent({
  formControl,
  formName,
  formLabel,
  disabled,
  readOnly,
}: IRatingComponent) {
  return (
    <FormField
      name={formName}
      control={formControl}
      render={({ field }) => (
        <div className="space-y-2">
          {formLabel && <FormLabel>{formLabel}</FormLabel>}

          <FormControl>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    star <= field.value
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-primary"
                  }`}
                  onClick={() => !readOnly && !disabled && field.onChange(star)}
                />
              ))}
            </div>
          </FormControl>
        </div>
      )}
    />
  );
}
