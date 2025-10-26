"use client";

import { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface IOpeningHoursField {
  formName: string;
  formContext: any;
  className?: string;
}

export function OpeningHoursField({
  formName,
  className,
  formContext,
}: IOpeningHoursField) {
  const { control, watch } = formContext;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${formName}.periods` as const,
  });

  const rawPeriods = watch(`${formName}.periods`);
  const periods = useMemo(() => rawPeriods || [], [rawPeriods]);

  const usedDays = useMemo(
    () => new Set(periods.map((p: any) => p.day)),
    [periods]
  );

  const availableDays = daysOfWeek
    .map((day, i) => ({ label: day, value: i }))
    .filter((d) => !usedDays.has(d.value));

  return (
    <div className={cn("space-y-6", className)}>
      {/* === Period List === */}
      <div className="space-y-2">
        <h4 className="font-semibold text-base">Opening Hours (optional)</h4>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No opening hours added yet.
          </p>
        )}

        {fields.map((field, index) => {
          const dayValue = periods[index]?.day ?? "";

          return (
            <div
              key={field.id}
              className={cn(
                "relative flex flex-col gap-3 border rounded-lg bg-muted/30 p-4 transition hover:bg-muted/50",
                "sm:grid sm:grid-cols-2 md:grid-cols-4 md:gap-4"
              )}
            >
              {/* === Day select === */}
              <FormField
                control={control}
                name={`${formName}.periods.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Day
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value ?? "")}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day, i) => (
                            <SelectItem
                              key={i}
                              value={String(i)}
                              disabled={usedDays.has(i) && i !== dayValue}
                            >
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* === Open time === */}
              <FormField
                control={control}
                name={`${formName}.periods.${index}.openTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Open Time
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="text-sm" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* === Close time === */}
              <FormField
                control={control}
                name={`${formName}.periods.${index}.closeTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Close Time
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="text-sm" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* === Remove button === */}
              <div className="flex sm:justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-1 sm:mt-auto w-full sm:w-auto"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}

        {/* === Add new day === */}
        <div className="flex justify-start">
          <Button
            type="button"
            size="sm"
            className="mt-2"
            disabled={availableDays.length === 0}
            onClick={() =>
              append({
                day: availableDays[0]?.value ?? 0,
                openTime: "08:00",
                closeTime: "17:00",
              })
            }
          >
            {availableDays.length === 0 ? "All days added" : "Add Day"}
          </Button>
        </div>
      </div>
    </div>
  );
}
