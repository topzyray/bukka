"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadFile } from "@/utils/upload-utils";
import { apiRequest } from "@/utils/api-client-utils";
import { ImageUploader } from "@/components/onboarding/image-uploader";
import { Form } from "@/components/ui/form";
import { GenderEnum } from "@/server/enums/GenderEnum";
import { Phone, User } from "lucide-react";
import TextAreaComponent from "@/components/forms/base/text-area-component";
import { PhoneNumberInput } from "@/components/forms/base/PhoneNumberInput";
import SelectComponent from "@/components/forms/base/select-component";
import InputComponent from "@/components/forms/base/input-component";
import { useProfileUpdate } from "@/server/hooks/auth/use-profile-update.hook";

export default function UserOnboarding() {
  const {
    userProfileUpdateSchema,
    singleProfilePictureSchema,
    updateUserProfileMutation,
  } = useProfileUpdate();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof userProfileUpdateSchema>>({
    mode: "all",
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      bio: "",
      gender: "" as GenderEnum,
    },
  });

  function onSubmit(data: z.infer<typeof userProfileUpdateSchema>) {
    setLoading(true);
    try {
      let imageUploadResult = null;

      if (profileImage) {
        imageUploadResult = uploadFile(profileImage, "USER_PROFILE_IMAGE");
      }

      apiRequest("/api/user/update", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          profileImage: imageUploadResult,
        }),
      });

      toast.success("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 animate-in fade-in duration-300"
      >
        <div className="flex flex-col items-center gap-1">
          <ImageUploader
            label="Select profile picture"
            onChange={(file) => console.log("CURRENT FILE", file)}
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 300x300px
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-end h-full">
            <InputComponent
              formControl={form.control}
              formName="firstName"
              formInputType="text"
              formPlaceholder="First name"
              disabled={updateUserProfileMutation.isPending}
              icon={User}
            />
          </div>
          <div className="flex flex-col justify-end h-full">
            <InputComponent
              formControl={form.control}
              formName="lastName"
              formInputType="text"
              formPlaceholder="Last name"
              disabled={updateUserProfileMutation.isPending}
              icon={User}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-end h-full">
            <InputComponent
              formControl={form.control}
              formName="username"
              formInputType="text"
              formPlaceholder="Username"
              disabled={updateUserProfileMutation.isPending}
              icon={User}
            />
          </div>

          <div className="flex flex-col justify-end h-full">
            <SelectComponent
              formControl={form.control}
              formName="role"
              formPlaceholder="Gender"
              formOptionLabel="I am a"
              formOptionData={[
                { value: GenderEnum.MALE, label: "Male" },
                { value: GenderEnum.FEMALE, label: "Female" },
                { value: GenderEnum.NON_BINARY, label: "Non-Binary" },
                { value: GenderEnum.OTHERS, label: "Other" },
              ]}
              icon={User}
              disabled={updateUserProfileMutation.isPending}
            />
          </div>
        </div>
        <PhoneNumberInput
          formControl={form}
          formName="phoneNumber"
          autoDetect={true}
          disabled={updateUserProfileMutation.isPending}
          icon={Phone}
        />

        <TextAreaComponent
          formControl={form.control}
          formName="bio"
          formPlaceholder="Bio"
          formDescription="Max 150 characters"
          disabled={updateUserProfileMutation.isPending}
          maxLength={150}
        />
        <Button
          disabled={loading}
          className="w-full mt-4 bg-gradient-primary text-white hover-glow"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </Button>
      </form>
    </Form>
  );
}
