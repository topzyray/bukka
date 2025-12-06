import * as z from "zod";

export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/; // HH:mm format

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

export const locationSchema = z.object({
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
  suburb: z.string().or(z.literal("")).optional().nullable(),
  county: z.string().or(z.literal("")).optional().nullable(),
  street: z.string().or(z.literal("")).optional().nullable(),
});

export const businessSchema = z.object({
  ownerId: z.coerce
    .number({ error: "Owner ID must be a number" }) // still coerces strings to numbers
    .int()
    .min(1, { message: "Owner ID must be a positive integer" })
    .optional(),
  recommenderId: z.coerce
    .number({ error: "Owner ID must be a number" }) // still coerces strings to numbers
    .int()
    .min(1, { message: "Owner ID must be a positive integer" })
    .optional(),
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
