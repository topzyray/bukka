"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { TextAreaComponent } from "@/components/form-ui/base/text-area-component";
import { LocationInput } from "@/features/location/location-input";
import { useCategoriesQuery } from "@/data/queries/use-businesses-category-query";
import { SelectFieldCustom } from "@/components/form-ui/custom/entity-select-field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { useMemo } from "react";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";
import { PhoneNumberInput } from "@/components/form-ui/base/phone-number-component";
import { Loader2 } from "lucide-react";
import { useAddRecommendation } from "@/data/mutations/recommendation/use-recommendation-mutation";
import { BukkaButton } from "@/components/ui";

const locationSchema = z.object({
  latitude: z.coerce
    .number({ error: "Latitude is required" })
    .min(-90, { message: "Latitude must be ≥ -90" })
    .max(90, { message: "Latitude must be ≤ 90" }),
  longitude: z.coerce
    .number({ error: "Longitude is required" })
    .min(-180, { message: "Longitude must be ≥ -180" })
    .max(180, { message: "Longitude must be ≤ 180" }),
  address: z.string().min(1, { error: "Required" }),
  city: z.string().min(1, { error: "Required" }),
  state: z.string().min(1, { error: "Required" }),
  country: z.string().min(1, { error: "Required" }),
});

const publicRecommendationSchema = z.object({
  name: z
    .string({ error: "Business name is required" })
    .min(2, { message: "Business name must be at least 2 characters long" }),
  categoryId: z.coerce
    .number({ error: "Category is required" })
    .int({ message: "Category ID must be a number" }),
  description: z.string().or(z.literal("")).optional().nullable(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, { message: "Invalid phone number" })
    .or(z.literal(""))
    .optional()
    .nullable(),
  email: z
    .email({ message: "Invalid email address" })
    .or(z.literal(""))
    .optional()
    .nullable(),
  website: z.url().or(z.literal("")).optional().nullable(),
  note: z.string().min(5, "Please tell us a bit more"),
  location: locationSchema,
});

export type PublicRecommendationValues = z.infer<
  typeof publicRecommendationSchema
>;

interface IRecommendBusinessForm {
  onSuccess?: () => void;
}

export function RecommendBusinessForm({ onSuccess }: IRecommendBusinessForm) {
  const PAGE_SIZE = 20;

  const { data: categoryApiData } = useCategoriesQuery({
    search: "",
    filters: {},
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const categoriesData: BusinessCategory[] = useMemo(
    () => categoryApiData?.responseData?.data ?? [],
    [categoryApiData]
  );

  const form = useForm({
    resolver: zodResolver(publicRecommendationSchema),
    mode: "onSubmit",
  });

  const createMutation = useAddRecommendation({
    onSuccess,
    resetForm: form.reset,
  });

  const busy = form.formState.isSubmitting;

  const onSubmit = (data: PublicRecommendationValues) => {
    const { location, ...otherData } = data;
    const category =
      (categoriesData &&
        categoriesData.length &&
        (categoriesData.find(
          (cat: BusinessCategory) => cat?.id === data?.categoryId
        ) as BusinessCategory)) ||
      null;

    let payload: any = {
      ...otherData,
      longitude: Number(location?.longitude.toFixed(6)),
      latitude: Number(location?.latitude.toFixed(6)),
      type: category?.type,
      slug: category?.slug,
      address: location?.address,
      city: location?.city,
      state: location?.state,
      country: location?.country,
    };
    createMutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <ScrollArea className="w-full h-full px-4">
          <div className="space-y-6 w-full h-full px-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold">
                Where is this place? (all required)
              </h3>

              <LocationInput
                provider={MapProviderEnum.LOCATIONIQ}
                formName="location"
                control={form.control}
                useReverseGeocode={false}
                disabled={busy}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputComponent
                formControl={form.control}
                formName="location.address"
                formInputType="text"
                formLabel="Address"
                formPlaceholder="e.g. 10th Avenue"
                disabled={busy}
              />
              <InputComponent
                formControl={form.control}
                formName="location.city"
                formInputType="text"
                formLabel="City"
                formPlaceholder="e.g. Abuja"
                disabled={busy}
              />
              <InputComponent
                formControl={form.control}
                formName="location.state"
                formInputType="text"
                formLabel="State"
                formPlaceholder="e.g. FCT"
                disabled={busy}
              />
              <InputComponent
                formControl={form.control}
                formName="location.country"
                formInputType="text"
                formLabel="Country"
                formPlaceholder="e.g. Nigeria"
                disabled={busy}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-semibold">Business Info</h3>

              <InputComponent
                formControl={form.control}
                formName="name"
                formInputType="text"
                formLabel="Business Name"
                formPlaceholder="e.g. The Red Café"
                disabled={busy}
              />

              <SelectFieldCustom
                control={form.control}
                formName="categoryId"
                formLabel="Category"
                formData={categoriesData}
                valueKey="id"
                labelKey="name"
                placeholder="Select category"
              />

              <TextAreaComponent
                formControl={form.control}
                formName="description"
                formLabel="Description (optional)"
                formPlaceholder="Describe the place briefly"
                rows={3}
              />

              <PhoneNumberInput
                formControl={form}
                formName="phoneNumber"
                formLabel="Phone Number (optional)"
                disabled={busy}
              />

              <InputComponent
                formControl={form.control}
                formName="email"
                formInputType="email"
                formLabel="Business Email (optional)"
                formPlaceholder="hello@mamaput.com"
                disabled={busy}
              />

              <InputComponent
                formControl={form.control}
                formName="website"
                formLabel="Website (optional)"
                formInputType="url"
                formPlaceholder="https://example.com"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-semibold">
                Why are you recommending this place?
              </h3>

              <TextAreaComponent
                formControl={form.control}
                formName="note"
                formLabel="Your Note"
                formPlaceholder="Tell us why this place is worth adding…"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <BukkaButton
                type="submit"
                disabled={busy || !form.formState.isValid}
                className="flex-1"
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Recommendation"
                )}
              </BukkaButton>
              <BukkaButton
                variant="ghost"
                onClick={() => form.reset()}
                type="button"
                disabled={busy}
              >
                Reset
              </BukkaButton>
            </div>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
