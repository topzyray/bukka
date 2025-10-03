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

type ITextAreaComponentProps = {
  formControl: any;
  // formControl: any;
  formName: string;
  formLabel: ReactNode;
  formPlaceholder: string;
  formDescription: string;
  rows: number;
  disabled: boolean;
  inputClassName: string;
};

export default function TextAreaComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  rows,
  disabled,
  inputClassName,
}: ITextAreaComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-0.5">
          <FormLabel className="text-lg">{formLabel}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={formPlaceholder}
              className={`text-lg ${inputClassName}`}
              disabled={disabled}
              rows={rows ?? 10}
              {...field}
            />
          </FormControl>
          <FormDescription>{formDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
