"use client";

import React from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Business } from "@/server/interfaces/Business";
import { Separator } from "@/components/ui/separator";
import { CreateEditBusinessForm } from "./component/create-edit-business-form";

const locationSchema = z.object({
  latitude: z.coerce
    .number({ error: "Latitude is required" })
    .min(-90, { message: "Latitude must be ≥ -90" })
    .max(90, { message: "Latitude must be ≤ 90" }),
  longitude: z.coerce
    .number({ error: "Longitude is required" })
    .min(-180, { message: "Longitude must be ≥ -180" })
    .max(180, { message: "Longitude must be ≤ 180" }),
  placeId: z.string().or(z.literal("")).optional().nullable(),
  address: z.string().or(z.literal("")).optional().nullable(),
  city: z.string().or(z.literal("")).optional().nullable(),
  state: z.string().or(z.literal("")).optional().nullable(),
  country: z.string().or(z.literal("")).optional().nullable(),
  cityId: z.string().or(z.literal("")).optional().nullable(),
  stateId: z.string().or(z.literal("")).optional().nullable(),
  countryId: z.string().or(z.literal("")).optional().nullable(),
  zipCode: z.string().or(z.literal("")).optional().nullable(),
  landmark: z.string().or(z.literal("")).optional().nullable(),
});

export const createBusinessSchema = z.object({
  ownerId: z.coerce
    .number({ error: "Owner ID is required" })
    .int()
    .min(1, { message: "Owner ID must be a positive integer" }),
  name: z
    .string({ error: "Business name is required" })
    .min(2, { message: "Business name must be at least 2 characters long" }),
  type: z
    .string({ error: "Business type is required" })
    .min(2, { message: "Business type must be valid" }),
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
  openingHours: z
    .record(z.string(), z.string())
    .or(z.literal(""))
    .optional()
    .nullable()
    .refine(
      (obj) => {
        if (!obj) return true;
        return Object.entries(obj).every(
          ([, v]) => typeof v === "string" && /\d{2}:\d{2}-\d{2}:\d{2}/.test(v)
        );
      },
      { message: "Opening hours must be in HH:mm-HH:mm format" }
    ),
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

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

type Props = {
  initial?: Partial<Business>;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export function CreateUpdateBusinessModal({
  initial,
  mode = "create",
  trigger,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>{isEdit ? "Edit Business" : "Add Business"}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Business" : "Create Business"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <CreateEditBusinessForm
          onSuccess={onSuccess}
          isEdit={isEdit}
          initial={initial}
          scrollAreaClassName="max-h-[75vh] h-full"
        />
      </DialogContent>
    </Dialog>
  );
}

// export function CreateUpdateBusinessModal({
//   initial,
//   mode = "create",
//   trigger,
//   onSuccess,
// }: Props) {
//   const isEdit = mode === "edit";
//   const { data: catData } = useBusinessCategories(true);
//   const { data: locData } = useLocations();

//   const createMutation = useCreateBusiness({ onSuccess });
//   const updateMutation = useUpdateBusiness({ onSuccess });

//   const form = useForm<CreateBusinessFormValues>({
//     resolver: zodResolver(createBusinessSchema),
//     mode: "onChange",
//     defaultValues: {
//       name: initial?.name ?? "",
//       description: initial?.description ?? "",
//       type: initial?.type ?? "RESTAURANT",
//       categoryId: initial?.categoryId,
//       phoneNumber: initial?.phoneNumber ?? "",
//       email: initial?.email ?? "",
//       website: initial?.website ?? "",
//       locationId: initial?.locationId ?? null,
//       iconUrl: (initial as any)?.iconUrl ?? null,
//       coverUrl: (initial as any)?.coverUrl ?? null,
//     },
//   });

//   useEffect(() => {
//     form.reset({
//       name: initial?.name ?? "",
//       description: initial?.description ?? "",
//       type: initial?.type ?? "RESTAURANT",
//       phoneNumber: initial?.phoneNumber ?? "",
//       email: initial?.email ?? "",
//       website: initial?.website ?? "",
//       iconUrl: (initial as any)?.iconUrl ?? null,
//       coverUrl: (initial as any)?.coverUrl ?? null,
//     });
//   }, [initial, form]);

//   const onSubmit = (data: CreateBusinessFormValues) => {
//     console.log("FORM DATA: ", data);

//     const payload: CreateBusinessDto = {
//       name: data.name,
//       description: data.description as string,
//       type: data.type as any,
//       categoryId: data.categoryId ?? null,
//       phoneNumber: data.phoneNumber ?? undefined,
//       email: data.email ?? undefined,
//       website: data.website ?? undefined,
//       iconUrl: data.iconUrl ?? null,
//       coverUrl: data.coverUrl ?? null,
//     };
//     console.log("PAYLOAD: ", payload);

//     if (isEdit && initial?.id) {
//       updateMutation.mutate({ id: initial.id, payload });
//     } else {
//       createMutation.mutate(payload);
//     }
//   };

//   const busy = createMutation.isPending || updateMutation.isPending;

//   //   Note: Icon/cover inputs are simple URLs. If you want file upload integration, I can add a small uploader that uses your FileRepository endpoints.

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {trigger ?? <Button>{isEdit ? "Edit" : "Add Business"}</Button>}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[720px] rounded-2xl shadow-elegant">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Business" : "Create Business"}
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="">
//             <ScrollArea className="max-h-[80vh] h-full w-full space-y-4">
//               <div className="h-full w-full px-4 space-y-4">
//                 <div>
//                   <LocationInput
//                     provider={MapProviderEnum.LOCATIONIQ}
//                     formName="location"
//                     useReverseGeocode={false}
//                     control={form.control}
//                     onChange={(location) => console.log("LOC: ", { location })}
//                   />
//                 </div>

//                 <div className="space-y-4 mt-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <InputComponent
//                       formControl={form.control}
//                       formName="ownerId"
//                       formInputType="text"
//                       formLabel="Business Owner"
//                       formPlaceholder="Olabimpe Taiwo"
//                     />

//                     <InputComponent
//                       formControl={form.control}
//                       formName="name"
//                       formInputType="text"
//                       formLabel="Business Name"
//                       formPlaceholder="e.g. Mama Nkechi Bukka"
//                     />

//                     <SelectField
//                       control={form.control}
//                       formName="categoryType"
//                       categories={catData?.responseData?.data ?? []}
//                       valueKey="type"
//                       labelKey="type"
//                     />

//                     <SelectField
//                       control={form.control}
//                       formName="categoryId"
//                       formLabel="Category"
//                       categories={catData?.responseData?.data ?? []}
//                       placeholder="Select category"
//                     />

//                     <InputComponent
//                       formControl={form.control}
//                       formName="registrationNo"
//                       formInputType="text"
//                       formLabel="Business Reg. No"
//                       formPlaceholder="RC-172823434"
//                     />

//                     <PhoneNumberInput
//                       formControl={form}
//                       formName="phoneNumber"
//                       formLabel="Phone Number"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <InputComponent
//                       formControl={form.control}
//                       formName="email"
//                       formInputType="email"
//                       formLabel="Business Email"
//                       formPlaceholder="hello@mamaput.com"
//                     />

//                     <InputComponent
//                       formControl={form.control}
//                       formName="website"
//                       formInputType="text"
//                       formLabel="Business Website"
//                       formPlaceholder="https://mamaput.com"
//                     />
//                   </div>

//                   <TextAreaComponent
//                     formControl={form.control}
//                     formName="description"
//                     formPlaceholder="Short description about business"
//                     inputClassName="min-h-[120px]"
//                   />

//                   <DialogFooter>
//                     <div className="flex gap-2 w-full">
//                       <Button
//                         type="submit"
//                         className="flex-1"
//                         disabled={busy || !form.formState.isValid}
//                       >
//                         {busy ? (
//                           <Loader2 className="animate-spin mr-2 h-4 w-4" />
//                         ) : isEdit ? (
//                           "Save changes"
//                         ) : (
//                           "Create business"
//                         )}
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         onClick={() => form.reset()}
//                         type="button"
//                       >
//                         Reset
//                       </Button>
//                     </div>
//                   </DialogFooter>
//                 </div>
//               </div>
//             </ScrollArea>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
