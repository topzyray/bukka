"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FieldValues, Path, Control } from "react-hook-form";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ITagInputFieldProps<T extends FieldValues> {
  formControl: Control<T>;
  formName: Path<T>;
  formLabel?: string;
  formPlaceholder?: string;
  enableSuggestions?: boolean;
  suggestions?: string[];
  inputClassName?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}

export function TagInputComponent<T extends FieldValues>({
  formControl,
  formName,
  formLabel = "Tags",
  formPlaceholder = "Add item...",
  enableSuggestions = false,
  suggestions = [],
  disabled,
  icon: Icon,
  inputClassName,
  ...props
}: ITagInputFieldProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={formName}
      control={formControl}
      render={({ field, fieldState }) => {
        const currentTags: string[] = field.value || [];

        const addTag = (tag: string) => {
          const newTag = tag.trim();
          if (
            newTag &&
            !currentTags.some((t) => t.toLowerCase() === newTag.toLowerCase())
          ) {
            field.onChange([...currentTags, newTag]);
          }
          setInputValue("");
          setOpen(false);
        };

        const removeTag = (tag: string) => {
          field.onChange(currentTags.filter((t) => t !== tag));
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (["Enter", ","].includes(e.key)) {
            e.preventDefault();
            addTag(inputValue);
          }
        };

        const filteredSuggestions = suggestions.filter(
          (s) =>
            !currentTags.includes(s) &&
            s.toLowerCase().includes(inputValue.toLowerCase())
        );

        const isError = !!fieldState.error;
        const isValid = !isError && field.value?.length > 0;

        return (
          <FormItem>
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

            <section className="relative flex items-center">
              <FormControl>
                <div
                  className={cn(
                    Icon && "pl-8",
                    "focus-within:ring-primary/50 flex flex-wrap items-center gap-1 rounded-md border px-3 focus-within:ring-1 cursor-text",
                    "pr-8",
                    isError &&
                      "border-red-600 focus-visible:ring-red-600 text-red-700",
                    isValid &&
                      "border-green-600 focus-visible:ring-green-600 text-green-700",
                    "focus:outline-none focus:ring-0 focus:border-none"
                  )}
                >
                  {currentTags.length ? (
                    <section className="mt-1.5 flex flex-wrap items-center gap-1">
                      {currentTags.map((tag) => (
                        <Badge
                          key={tag}
                          className="flex items-center gap-1 text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-xs hover:cursor-pointer hover:text-red-500"
                            onClick={() => removeTag(tag)}
                          >
                            <X size={15} />
                          </button>
                        </Badge>
                      ))}
                    </section>
                  ) : null}

                  {enableSuggestions ? (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild className="w-full px-0">
                        <span className="relative">
                          {Icon && (
                            <Icon className="absolute left-0 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          )}
                          <Input
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={formPlaceholder}
                            className={cn(
                              "w-full flex-1 border-none text-sm ring-0 outline-none px-0 rounded-none  focus-visible:border-ring focus-visible:ring-none focus-visible:ring-[0px]",
                              inputClassName,
                              Icon && "pl-4.5"
                            )}
                            {...props}
                          />
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search…"
                            disabled={disabled}
                          />
                          <CommandList>
                            {filteredSuggestions.length > 0 ? (
                              filteredSuggestions.map((item) => (
                                <CommandItem
                                  key={item}
                                  value={item}
                                  onSelect={() => addTag(item)}
                                >
                                  {item}
                                </CommandItem>
                              ))
                            ) : (
                              <p className="text-muted-foreground p-2 text-xs">
                                No matches
                              </p>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="relative">
                      {Icon && (
                        <Icon className="absolute left-0 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      )}
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={formPlaceholder}
                        className={cn(
                          "w-full flex-1 border-none text-sm ring-0 outline-none px-0 rounded-none  focus-visible:border-ring focus-visible:ring-none focus-visible:ring-[0px]",
                          inputClassName,
                          Icon && "pl-4.5"
                        )}
                        {...props}
                      />
                    </span>
                  )}
                </div>
              </FormControl>

              {/* Right validation icons */}
              {isError && (
                <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
              )}
              {isValid && (
                <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              )}
            </section>
            <FormMessage className="-mt-2 text-left" />
          </FormItem>
        );
      }}
    />
  );
}
