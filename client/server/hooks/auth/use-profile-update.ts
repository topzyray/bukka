import { AuthApiService } from "@/server/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { toast } from "sonner";
import { z } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";
import { GenderEnum } from "@/server/enums/GenderEnum";

export const useProfileUpdate = () => {
  // const queryClient = useQueryClient();

  const singleProfilePictureSchema = z.object({
    image: z
      .instanceof(File, { message: "A file is required." })
      .refine((file) => file.size > 0, { message: "File is required." }),
  });

  // const multipleProfilePictureSchema = z.object({
  //   image: z
  //     .instanceof(File, { message: "A file is required." })
  //     .array()
  //     .refine((file) => file.size > 0, { message: "File is required." }),
  // });

  const allowedGenders = Object.values(GenderEnum);

  const userProfileUpdateSchema = z.object({
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

  const updateUserProfileMutation = useCustomMutation(AuthApiService.signUp, {
    onSuccessCallback: (data) => {
      console.log("SIGN UP DATA: ", data);
    },

    onErrorCallback: (error) => {
      console.log("ERROR SIGNING UP USER: ", error);
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    singleProfilePictureSchema,
    userProfileUpdateSchema,
    updateUserProfileMutation,
    // multipleProfilePictureSchema,
  };
};
