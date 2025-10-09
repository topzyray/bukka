import { z } from "zod";
import { GenderEnum } from "@/server/enums/GenderEnum";

/**
 * Shared schemas
 */
export const imageUploadSchema = z.object({
  imageFile: z.instanceof(File),
});

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 chars"),
  phoneNumber: z.string().optional(),
  bio: z.string().max(150).optional(),
  gender: z.nativeEnum(GenderEnum).optional(),
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
