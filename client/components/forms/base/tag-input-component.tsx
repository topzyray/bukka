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
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ITagInputFieldProps<T extends FieldValues> {
  formControl: Control<T>;
  formName: Path<T>;
  formLabel?: string;
  formPlaceholder?: string;
  enableSuggestions?: boolean;
  suggestions?: string[];
  disabled?: boolean;
}

export function TagInputComponent<T extends FieldValues>({
  formControl,
  formName,
  formLabel = "Tags",
  formPlaceholder = "Add item...",
  enableSuggestions = false,
  suggestions = [],
  disabled,
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

            <FormControl>
              <div className="focus-within:ring-foreground flex min-h-[50px] flex-wrap items-center gap-2 rounded-md border px-3 py-2 focus-within:ring-2">
                {currentTags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1 text-sm">
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

                {enableSuggestions ? (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Input
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={formPlaceholder}
                        className="w-auto min-w-[100px] flex-1 border-none text-sm ring-0 outline-none"
                      />
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
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={formPlaceholder}
                    className="w-auto min-w-[100px] flex-1 border-none text-sm ring-0 outline-none"
                  />
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
