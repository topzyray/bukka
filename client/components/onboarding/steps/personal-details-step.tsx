"use client";

import { z } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputComponent } from "@/components/forms/base/input-component";
import { SelectComponent } from "@/components/forms/base/select-component";
import { PhoneNumberInput } from "@/components/forms/base/phone-number-component";
import { TextAreaComponent } from "@/components/forms/base/text-area-component";
import { GenderEnum } from "@/server/enums";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useUpdateUserData } from "@/server/mutations/user/use-update-user-data";
import { TextHelper } from "@/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboardingProgress } from "@/server/queries/use-onboarding-progress-query";
import { CircularLoader } from "@/components/loaders/circular-loader";

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
    .min(2, "Bio cannot be less than 2 characters")
    .max(150, { error: "Bio cannot be greater than 100 characters" }),
  gender: z
    .string()
    .min(1, { error: "Gender is required" })
    .refine((val) => allowedGenders.includes(val as GenderEnum), {
      message: "Invalid gender selection",
    }),
});

type ProfileDetialsFormData = z.infer<typeof personalDetailsSchema>;

export function PersonalDetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {},
    mode: "all",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: TextHelper.capitalizeWords(user?.firstName),
        lastName: TextHelper.capitalizeWords(user?.lastName),
        email: user?.email,
        username: TextHelper.capitalizeWords(user?.username),
        gender: TextHelper.capitalizeWords(user?.gender),
        phoneNumber: user?.phoneNumber ?? "",
        bio: TextHelper.capitalizeWords(user?.bio) ?? "",
      });
    }
  }, [user, form]);

  const { data: savedProgress, isLoading: isFetchingProgress } =
    useOnboardingProgress(user?.id as number);

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      onSuccess: () => {
        form.reset;
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        onNext();
      },
    });

  const onSubmit = async (data: ProfileDetialsFormData) => {
    if (!user?.id) {
      toast.error("User not found. Please sign in again.");
      return;
    }
    const payload = {
      phoneNumber: data?.phoneNumber,
      gender: data?.gender,
      username: data?.username,
      bio: data?.bio,
      onboardingProgress: savedProgress + 1,
    };
    updateUserData(payload);
  };

  return (
    <>
      {isFetchingProgress ? (
        <CircularLoader text="Loading User Personal Details Form" />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 animate-in fade-in duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputComponent
                formControl={form.control}
                formName="firstName"
                formInputType="text"
                formPlaceholder="First name"
                readOnly
                disabled={isUpdatingUserData}
              />
              <InputComponent
                formControl={form.control}
                formName="lastName"
                formInputType="text"
                formPlaceholder="Last name"
                readOnly
                disabled={isUpdatingUserData}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <InputComponent
              formControl={form.control}
              formName="email"
              formInputType="text"
              formPlaceholder="Emil"
              readOnly
              disabled={isUpdatingUserData}
            />

            <PhoneNumberInput
              formControl={form}
              formName="phoneNumber"
              autoDetect
              disabled={isUpdatingUserData}
            />

            <TextAreaComponent
              formControl={form.control}
              formName="bio"
              formPlaceholder="Bio"
              formDescription="Max 150 characters"
              maxLength={150}
              disabled={isUpdatingUserData}
            />

            <div className="flex gap-2 justify-end pt-4 border-t border-border/30">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isUpdatingUserData}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={isUpdatingUserData || !form.formState.isValid}
              >
                {isUpdatingUserData ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
