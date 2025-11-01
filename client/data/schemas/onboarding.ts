import { z } from "zod";
import { GenderEnum } from "@/data/enums";
import parsePhoneNumberFromString from "libphonenumber-js";

/**
 * Shared schemas
 */
export const imageUploadSchema = z.object({
  imageFile: z.instanceof(File),
});

const allowedGenders = Object.values(GenderEnum);

export const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  username: z.string().min(2, "Username is required"),
  phoneNumber: z
    .string()
    .nonempty("Phone is required")
    .refine(
      (val) => {
        if (!val.startsWith("+")) return false; // enforce leading +
        const phoneNumber = parsePhoneNumberFromString(val);
        return phoneNumber?.isValid() || false;
      },
      {
        message: "Invalid phonenumber",
      }
    ),
  bio: z
    .string()
    .min(2, "Bio cannot be less than 2 characters")
    .max(150, { error: "Bio cannot be greater than 100 characters" }),
  gender: z
    .string()
    .min(1, { error: "Gender is required" })
    .refine((val) => allowedGenders.includes(val as GenderEnum), {
      message: "Invalid gender selection",
    }),
});

/**
 * Example role-specific schemas
 */
export const riderVehicleSchema = z.object({
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  plateNumber: z.string().min(1),
  licenseImageFile: z.instanceof(File).optional(),
});

export const businessDetailsSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  businessAddress: z.string().min(1),
  businessImages: z.array(z.instanceof(File)).optional(),
});

export const investorDetailsSchema = z.object({
  investmentExperienceYears: z.number().int().min(0),
  primaryInvestmentType: z.string().min(1),
  accreditedInvestor: z.boolean(),
});

/** Types */
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type RiderVehicleDetails = z.infer<typeof riderVehicleSchema>;
export type BusinessDetails = z.infer<typeof businessDetailsSchema>;
export type InvestorDetails = z.infer<typeof investorDetailsSchema>;
