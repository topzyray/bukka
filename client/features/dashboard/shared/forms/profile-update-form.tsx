"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { TextHelper } from "@/helpers";
import { GenderEnum } from "@/data/enums";
import { useForm } from "react-hook-form";
import { Card, Form } from "@/components/ui";
import { User } from "@/data/interfaces/User";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { SelectComponent } from "@/components/form-ui/base/select-component";
import { useUpdateUserData } from "@/data/mutations/user/use-update-user-data";
import { TextAreaComponent } from "@/components/form-ui/base/text-area-component";
import { PhoneNumberInput } from "@/components/form-ui/base/phone-number-component";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Loader2 } from "lucide-react";

const allowedGenders = Object.values(GenderEnum);

export const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email({ message: "Please enter a valid email address" }),
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
    // .min(2, "Bio cannot be less than 2 characters")
    .max(150, { error: "Bio cannot be greater than 100 characters" })
    .optional()
    .default(""),
  gender: z
    .string()
    .min(1, { error: "Gender is required" })
    .refine((val) => allowedGenders.includes(val as GenderEnum), {
      message: "Invalid gender selection",
    }),
});

type ProfileDetialsFormData = z.infer<typeof personalDetailsSchema>;

interface IProfileUpdateForm {
  user: User;
  setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileUpdateForm({
  user,
  setEditProfile,
}: IProfileUpdateForm) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      gender: "",
      phoneNumber: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      firstName: TextHelper.capitalizeWords(user?.firstName),
      lastName: TextHelper.capitalizeWords(user?.lastName),
      email: user?.email,
      username: user?.username,
      gender: user?.gender ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      bio: TextHelper.capitalizeWords(user?.bio ?? ""),
    });
  }, [form, user]);

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        setEditProfile(false);
      },
    });

  const onSubmit = async (data: ProfileDetialsFormData) => {
    if (!user?.id) {
      toast.error("User not found.", { description: "Please sign in again." });
      return;
    }
    const payload = {
      phoneNumber: data?.phoneNumber,
      bio: data?.bio,
    };
    updateUserData(payload);
  };

  return (
    <Card className="w-full mx-auto rounded-xl shadow-md border border-border overflow-hidden transition-all hover:shadow-lg">
      <div className="w-full p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 animate-in fade-in duration-300 w-full"
          >
            <div className="grid grid-cols-1 gap-4">
              <InputComponent
                formControl={form.control}
                formName="firstName"
                formInputType="text"
                formPlaceholder="First name"
                disabled={isUpdatingUserData}
              />
              <InputComponent
                formControl={form.control}
                formName="lastName"
                formInputType="text"
                formPlaceholder="Last name"
                disabled={isUpdatingUserData}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <InputComponent
                formControl={form.control}
                formName="username"
                formInputType="text"
                formPlaceholder="Username"
                disabled={isUpdatingUserData}
              />
              <SelectComponent
                formControl={form.control}
                formName="gender"
                formPlaceholder="Gender"
                formOptionLabel="I am a"
                formOptionData={[
                  { value: GenderEnum.MALE, label: "Male" },
                  { value: GenderEnum.FEMALE, label: "Female" },
                  { value: GenderEnum.NON_BINARY, label: "Non-Binary" },
                  { value: GenderEnum.OTHERS, label: "Other" },
                ]}
                disabled={isUpdatingUserData}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <InputComponent
                formControl={form.control}
                formName="email"
                formInputType="text"
                formPlaceholder="Emil"
                disabled={isUpdatingUserData}
              />

              <PhoneNumberInput
                formControl={form}
                formName="phoneNumber"
                autoDetect
                disabled={isUpdatingUserData}
                withKey={user?.phoneNumber !== null}
              />
            </div>

            <TextAreaComponent
              formControl={form.control}
              formName="bio"
              formPlaceholder="Bio"
              formDescription="Max 150 characters"
              maxLength={150}
              disabled={isUpdatingUserData}
            />

            <div className="flex gap-2 justify-end pt-4 border-t border-border/30">
              <Button
                type="button"
                onClick={() => setEditProfile(false)}
                disabled={isUpdatingUserData}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingUserData || !form.formState.isValid}
              >
                {isUpdatingUserData ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Saving
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
