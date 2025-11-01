"use client";

import { z } from "zod";
import { useAuth, useGlobalState } from "@/providers";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Form } from "@/components/ui/form";
import { UserRoleEnum } from "@/server/enums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/server/interfaces/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Business } from "@/server/interfaces/Business";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectFieldCustom } from "../../custom/entity-select-field";
import {
  useCreateBusiness,
  useUpdateBusiness,
} from "@/server/mutations/business/use-business-mutation";
import { InputComponent } from "../../base/input-component";
import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { useInfiniteUsers } from "@/server/queries/admin/use-users-query";
import { TextAreaComponent } from "../../base/text-area-component";
import { PhoneNumberInput } from "../../base/phone-number-component";
import { LocationInput } from "@/components/views/location/location-input";
import { useCategoriesQuery } from "@/server/queries/use-businesses-category-query";
import { cn } from "@/lib/utils";
import { BusinessCategory } from "@/server/interfaces/BusinessCategory";
import { OpeningHoursField } from "../../custom/openin-hours-field";
import { TagInputComponent } from "../../base/tag-input-component";
import { cuisineSuggestions } from "@/constants/menu-info";

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/; // HH:mm format

export const openingHoursSchema = z
  .object({
    periods: z
      .array(
        z
          .object({
            day: z.number().min(0).max(6).optional(),
            openTime: z
              .string()
              .regex(timeRegex, "Time must be in HH:mm format")
              .optional(),
            closeTime: z
              .string()
              .regex(timeRegex, "Time must be in HH:mm format")
              .optional(),
          })
          // Optional refinement only if both times are provided
          .refine(
            (p) => !p.openTime || !p.closeTime || p.openTime < p.closeTime,
            "Closing time must be after opening time"
          )
      )
      .optional()
      .default([]),

    weekdayText: z.array(z.string()).optional().default([]),
  })
  .optional()
  .nullable()
  .default(null);

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
  placeId: z.string().or(z.literal("")).optional().nullable(),
  cityId: z.string().or(z.literal("")).optional().nullable(),
  stateId: z.string().or(z.literal("")).optional().nullable(),
  countryId: z.string().or(z.literal("")).optional().nullable(),
  zipCode: z.string().or(z.literal("")).optional().nullable(),
  landmark: z.string().or(z.literal("")).optional().nullable(),
});

export const businessSchema = z.object({
  ownerId: z.coerce
    .number({ error: "Owner ID is required" })
    .int()
    .min(1, { message: "Owner ID must be a positive integer" }),
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
  registrationNo: z
    .string()
    .min(3, { message: "Registration number too short" })
    .or(z.literal(""))
    .optional()
    .nullable(),
  openingHours: openingHoursSchema.optional(),
  cuisines: z.array(z.string()).optional().default([]),
  socialLinks: z
    .object({
      instagram: z.url().or(z.literal("")).optional(),
      facebook: z.url().or(z.literal("")).optional(),
      twitter: z.url().or(z.literal("")).optional(),
      linkedin: z.url().or(z.literal("")).optional(),
      tiktok: z.url().or(z.literal("")).optional(),
    })
    .optional()
    .nullable(),
  location: locationSchema,
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

interface ICreateEditBusinessForm {
  isEdit: boolean;
  busy?: boolean;
  initialData?: Partial<Business>;
  scrollAreaClassName?: string;
  containerClassName?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export function CreateEditBusinessForm({
  isEdit,
  busy,
  initialData,
  scrollAreaClassName,
  containerClassName,
  onBack,
  onSuccess,
}: ICreateEditBusinessForm) {
  const PAGE_SIZE = 20;
  const [ownerInfo, setOwnerInfo] = useState<User | null>(null);
  const { user } = useAuth();
  const { coordinates } = useGlobalState();

  const { data: categoryApiData } = useCategoriesQuery({
    search: "",
    filters: {},
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const { data: vendorUserApiData } = useInfiniteUsers({
    enabled: user?.role === UserRoleEnum.ADMIN,
    filters: {
      role: UserRoleEnum.VENDOR,
    },
  });

  const categoriesData: BusinessCategory[] = useMemo(
    () => categoryApiData?.responseData?.data ?? [],
    [categoryApiData]
  );

  const vendorsData: User[] = useMemo(
    () => vendorUserApiData?.pages.flatMap((p) => p.data) ?? [],
    [vendorUserApiData]
  );

  const form = useForm({
    resolver: zodResolver(businessSchema),
    mode: "onSubmit",
  });

  // useEffect(() => {
  //   if (isEdit && initialData) {
  //     form.reset({
  //       location: {
  //         latitude: initialData?.location?.latitude,
  //         longitude: initialData?.location?.longitude,
  //         address: initialData?.location?.address,
  //         city: initialData?.location?.city,
  //         state: initialData?.location?.state,
  //         country: initialData?.location?.country,
  //       },
  //       name: initialData?.name,
  //       ownerId: initialData?.ownerId,
  //       phoneNumber: initialData?.phoneNumber,
  //       email: initialData?.email,
  //       registrationNo: initialData?.registrationNo,
  //       description: initialData?.description,
  //       website: initialData?.website,
  //       cuisines: initialData?.cuisines,
  //       categoryId: initialData?.category?.id,
  //       socialLinks: initialData?.socialLinks,
  //       openingHours: initialData?.openingHours,
  //     });
  //   }
  // }, [form, initialData, isEdit]);

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        location: {
          latitude: initialData?.location?.latitude,
          longitude: initialData?.location?.longitude,
          address: initialData?.location?.address,
          city: initialData?.location?.city,
          state: initialData?.location?.state,
          country: initialData?.location?.country,
        },
        name: initialData?.name ?? "",
        // prefer initialData.owner?.id first, fallback to initialData.ownerId
        ownerId: initialData?.owner?.id ?? initialData?.ownerId,
        phoneNumber: initialData?.phoneNumber ?? "",
        email: initialData?.email ?? "",
        registrationNo: initialData?.registrationNo ?? "",
        description: initialData?.description ?? "",
        website: initialData?.website ?? "",
        cuisines: initialData?.cuisines ?? [],
        categoryId: initialData?.category?.id ?? "",
        socialLinks: initialData?.socialLinks,
        openingHours: initialData?.openingHours,
      });
    }
  }, [form, initialData, isEdit]);

  useEffect(() => {
    if (coordinates) {
      form.setValue("location", {
        longitude: coordinates?.lng,
        latitude: coordinates?.lat,
        address: coordinates?.address as string,
        city: coordinates?.city as string,
        state: coordinates?.state as string,
        country: coordinates?.country as string,
      });
    }
  }, [coordinates, form]);

  const createMutation = useCreateBusiness({
    onSuccess,
    resetForm: form.reset,
  });
  const updateMutation = useUpdateBusiness({
    onSuccess,
    resetForm: form.reset,
  });

  busy = createMutation.isPending || updateMutation.isPending || busy;

  // const ownerId = form.watch("ownerId");

  // useEffect(() => {
  //   if (user?.role === UserRoleEnum.ADMIN && ownerId !== undefined) {
  //     const owner =
  //       vendorsData &&
  //       vendorsData.length &&
  //       vendorsData.find((user: User) => user?.id === ownerId);
  //     if (owner) setOwnerInfo(owner);
  //   } else {
  //     form.setValue("ownerId", user?.id);
  //     setOwnerInfo(user);
  //   }
  // }, [vendorsData, form, ownerId, user]);
  const watchedOwnerId = form.watch("ownerId");

  useEffect(() => {
    if (!user) return;

    // Vendor logged in => always use current user
    if (user.role === UserRoleEnum.VENDOR) {
      form.setValue("ownerId", user.id);
      setOwnerInfo(user);
      return;
    }

    // Admin logic
    if (user.role === UserRoleEnum.ADMIN) {
      // Edit: prefer initialData.owner (server-side owner object)
      if (isEdit && initialData?.owner) {
        setOwnerInfo(initialData.owner as User);
        // ensure form has ownerId (in case reset didn't run yet)
        form.setValue("ownerId", initialData.owner.id);
        return;
      }

      // Create: if admin selected a vendor (watchedOwnerId) and vendorsData available, use it
      if (
        watchedOwnerId !== undefined &&
        watchedOwnerId !== null &&
        String(watchedOwnerId) !== ""
      ) {
        const found = vendorsData?.find(
          (v) => String(v.id) === String(watchedOwnerId)
        );
        if (found) {
          setOwnerInfo(found);
          return;
        }
        // If not found in vendorsData but initialData.owner matches id, use it
        if (
          isEdit &&
          initialData?.owner &&
          String(initialData.owner.id) === String(watchedOwnerId)
        ) {
          setOwnerInfo(initialData.owner as User);
          return;
        }
      }

      // Default for admin create: no selection yet
      setOwnerInfo(null);
      return;
    }
  }, [user, vendorsData, watchedOwnerId, isEdit, initialData, form]);

  const onSubmit = (data: BusinessFormValues) => {
    const weekdayText =
      data.openingHours?.periods.map((p) => {
        const day = weekdayNames[p.day as number];
        return `${day}: ${p.openTime} - ${p.closeTime}`;
      }) ?? [];

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
      openingHours: {
        ...data.openingHours,
        weekdayText,
      },
    };
    if (isEdit && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <ScrollArea className={cn("w-full space-y-4", scrollAreaClassName)}>
          <div
            className={cn("h-full w-full px-4 space-y-4", containerClassName)}
          >
            <div className="space-y-2">
              <h3 className="text-base font-semibold">
                Business Location Info (all required)
              </h3>
              <LocationInput
                provider={MapProviderEnum.LOCATIONIQ}
                formName="location"
                useReverseGeocode={false}
                control={form.control}
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

            <div className="space-y-2">
              <h3 className="text-base font-semibold">
                Vendor Details (all required)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user?.role === UserRoleEnum.ADMIN ? (
                  <SelectFieldCustom
                    control={form.control}
                    formName="ownerId"
                    formLabel="Vendor's Email"
                    formData={vendorsData ?? []}
                    placeholder="Select user"
                    valueKey="id"
                    labelKey="email"
                    disabled={busy}
                  />
                ) : (
                  <div className="space-y-2">
                    <Label>Vendor&apos;s Email</Label>
                    <Input
                      type="text"
                      name="email"
                      value={
                        // vendor always uses logged-in user (edit/create)
                        user?.role === UserRoleEnum.VENDOR
                          ? user?.email ?? ""
                          : ""
                      }
                      className="focus:border-none text-sm placeholder:text-sm"
                      readOnly
                      disabled={busy}
                    />
                  </div>
                )}
                {/* <div className="space-y-2">
                  <Label>Vendor&apos;s Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    // value={
                    //   ownerInfo
                    //     ? ownerInfo?.firstName + " " + ownerInfo?.lastName
                    //     : ""
                    // }
                    value={
                      isEdit
                        ? initialData?.owner?.firstName +
                            " " +
                            initialData?.owner?.lastName ||
                          ownerInfo?.firstName + " " + ownerInfo?.lastName
                        : ownerInfo?.firstName + " " + ownerInfo?.lastName || ""
                    }
                    className="focus:border-none text-sm placeholder:text-sm"
                    readOnly
                    disabled={busy}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label>Vendor&apos;s Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    value={
                      // prefer initialData.owner when editing (authoritative),
                      // otherwise use ownerInfo (from select or logged-in user)
                      isEdit
                        ? initialData?.owner
                          ? `${initialData.owner.firstName} ${initialData.owner.lastName}`
                          : ownerInfo
                          ? `${ownerInfo.firstName} ${ownerInfo.lastName}`
                          : ""
                        : ownerInfo
                        ? `${ownerInfo.firstName} ${ownerInfo.lastName}`
                        : user?.role === UserRoleEnum.VENDOR
                        ? `${user?.firstName} ${user?.lastName}`
                        : ""
                    }
                    className="focus:border-none text-sm placeholder:text-sm"
                    readOnly
                    disabled={busy}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-base font-semibold">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputComponent
                  formControl={form.control}
                  formName="name"
                  formInputType="text"
                  formLabel="Business Name (required)"
                  formPlaceholder="e.g. Mama Nkechi Bukka"
                  disabled={busy}
                />

                <SelectFieldCustom
                  control={form.control}
                  formName="categoryId"
                  formLabel="Category (required)"
                  formData={categoriesData ?? []}
                  placeholder="Select category"
                  disabled={busy}
                />

                <InputComponent
                  formControl={form.control}
                  formName="registrationNo"
                  formInputType="text"
                  formLabel="Registration No (optional)"
                  formPlaceholder="RC-172823434"
                  disabled={busy}
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
                  formInputType="text"
                  formLabel="Website (optional)"
                  formPlaceholder="https://mamaput.com"
                  disabled={busy}
                />
              </div>
            </div>

            <TextAreaComponent
              formControl={form.control}
              formName="description"
              formLabel="Business Description (optional)"
              formPlaceholder="Short description about your business"
              inputClassName="min-h-[120px]"
              disabled={busy}
            />

            <Separator />

            <div className="space-y-2 w-full">
              <h3 className="text-base font-semibold">
                Available Menu (optional)
              </h3>
              <TagInputComponent
                formControl={form.control}
                formName="cuisines"
                formLabel="Add Your Cuisines"
                formPlaceholder="Type or select cuisines..."
                enableSuggestions
                suggestions={cuisineSuggestions}
                disabled={busy}
                inputClassName="w-full"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <OpeningHoursField formName="openingHours" formContext={form} />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-base font-semibold">
                Business Social Links (optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputComponent
                  formControl={form.control}
                  formName="socialLinks.instagram"
                  formInputType="text"
                  formLabel="Instagram URL"
                  formPlaceholder="https://instagram.com/business"
                  disabled={busy}
                />
                <InputComponent
                  formControl={form.control}
                  formName="socialLinks.facebook"
                  formInputType="text"
                  formLabel="Facebook URL"
                  formPlaceholder="https://facebook.com/business"
                  disabled={busy}
                />
                <InputComponent
                  formControl={form.control}
                  formName="socialLinks.twitter"
                  formInputType="text"
                  formLabel="Twitter URL"
                  formPlaceholder="https://twitter.com/business"
                  disabled={busy}
                />
                <InputComponent
                  formControl={form.control}
                  formName="socialLinks.linkedin"
                  formInputType="text"
                  formLabel="LinkedIn URL"
                  formPlaceholder="https://linkedin.com/company/business"
                  disabled={busy}
                />
                <InputComponent
                  formControl={form.control}
                  formName="socialLinks.tiktok"
                  formInputType="text"
                  formLabel="TikTok URL"
                  formPlaceholder="https://tiktok.com/@business"
                  disabled={busy}
                />
              </div>
            </div>

            <DialogFooter>
              <div className="flex gap-2 w-full">
                {onBack && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={busy}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={busy || !form.formState.isValid}
                >
                  {busy ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : isEdit ? (
                    "Save Changes"
                  ) : (
                    "Create Business"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => form.reset()}
                  type="button"
                  disabled={busy}
                >
                  Reset
                </Button>
              </div>
            </DialogFooter>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
