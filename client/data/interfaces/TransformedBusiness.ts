import * as z from "zod";
import { locationSchema, openingHoursSchema } from "../schemas/business";

export interface TransformedBusiness {
  recommenderId: number;
  name: string;
  categoryId: number;
  description?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  registrationNo?: string | null;
  openingHours?: z.infer<typeof openingHoursSchema>;
  cuisines?: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
  } | null;
  location: z.infer<typeof locationSchema>;
}
