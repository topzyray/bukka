import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Autocomplete from "react-google-autocomplete";
import { useEffect } from "react";
import axios from "axios";
import { envConfig } from "@/configs";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/providers";
import { toast } from "sonner";

interface ILocationInputProps {
  formControl: any;
  formName: string;
  formLabel?: React.ReactNode;
  disabled?: boolean;
  autoDetect?: boolean;
  handlePlaceSelect: (
    place: any,
    setValue: (field: string, value: any) => void
  ) => void;
  inputClassName?: string;
  icon?: React.ElementType;
}

export default function LocationInput2({
  formControl,
  formName,
  formLabel,
  disabled,
  autoDetect = false,
  handlePlaceSelect,
  inputClassName,
  icon: Icon,
}: ILocationInputProps) {
  const {
    userCoordinates,
    loading: loadingUserLocation,
    error: userLocationError,
    refreshUserLocation,
  } = useUserLocation();

  const { setValue, register, watch, formState } = formControl;
  const value = watch(formName as string);
  const errors = formState.errors as any;

  useEffect(() => {
    if (!autoDetect) return;

    if (loadingUserLocation) {
      toast.info("Fetching your location...");
      return;
    }

    if (userLocationError) {
      toast.error("Failed to fetch location", {
        description: userLocationError,
      });
      return;
    }

    if (userCoordinates) {
      (async () => {
        try {
          const { lat, lng } = userCoordinates;
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${envConfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );

          if (res.data.results?.[0]) {
            const place = res.data.results[0];
            handlePlaceSelect(place, setValue);
          }
        } catch (err) {
          console.error("Reverse geocode failed", err);
        }
      })();
    } else {
      refreshUserLocation();
    }
  }, [
    autoDetect,
    handlePlaceSelect,
    loadingUserLocation,
    refreshUserLocation,
    setValue,
    userCoordinates,
    userLocationError,
  ]);

  return (
    <FormField
      control={formControl.control}
      name={formName as string}
      render={({ field }) => {
        const isError =
          !!errors?.coordinates?.lat?.message ||
          !!errors?.coordinates?.long?.message ||
          !!errors?.coordinates?.placeId?.message;
        const isValid = !isError && field.value?.length > 0;

        return (
          <FormItem className="space-y-0.5">
            <FormLabel
              className={cn(
                "-mb-0.5",
                isError && "text-red-600",
                isValid && "text-green-600"
              )}
            >
              {formLabel}
            </FormLabel>
            <section className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <FormControl>
                <Autocomplete
                  apiKey={envConfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={(place) =>
                    handlePlaceSelect(place, setValue)
                  }
                  options={{ types: ["geocode"] }}
                  value={value || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(e.target.value)
                  }
                  placeholder="Select your current location"
                  disabled={disabled}
                  style={{
                    width: "100%",
                    paddingTop: "6px",
                    paddingBottom: "6px",
                    paddingLeft: Icon ? "36px" : "10px",
                    paddingRight: "10px",
                    fontSize: "14px",
                    outline: "none",
                    border: isError ? "1px solid #f87171" : "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-primary/50 focus-visible:ring-[1px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    inputClassName
                  )}
                />
              </FormControl>
            </section>
            <FormMessage>
              {errors?.coordinates?.lat?.message ||
                errors?.coordinates?.long?.message ||
                errors?.coordinates?.placeId?.message}
            </FormMessage>

            {/* Hidden inputs for coordinates */}
            <input type="hidden" {...register("coordinates.lat" as any)} />
            <input type="hidden" {...register("coordinates.long" as any)} />
            <input type="hidden" {...register("coordinates.placeId" as any)} />
          </FormItem>
        );
      }}
    />
  );
}
