"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadFile } from "@/utils/upload-utils";
import { apiRequest } from "@/utils/api-client-utils";
import { ImageUploader } from "@/components/onboarding/image-uploader";
import { Textarea } from "@/components/ui/textarea";

export default function BusinessOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    website: "",
    address: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverUploadResult = null;
      if (coverImage)
        coverUploadResult = await uploadFile(coverImage, "BUSINESS_COVER");

      await apiRequest("/api/business/create", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          coverImage: coverUploadResult,
        }),
      });

      toast.success("Business onboarded successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      <ImageUploader
        isBusiness={true}
        label="Upload your restaurant images"
        onChange={(files) => console.log(files)}
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Business Name"
          name="name"
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Phone Number"
          name="phoneNumber"
          onChange={handleChange}
          required
        />
      </section>
      <Input
        placeholder="Business Website"
        name="website"
        onChange={handleChange}
      />
      <Input placeholder="Address" name="address" onChange={handleChange} />
      <Textarea
        placeholder="About your business"
        name="description"
        onChange={handleChange}
      />
      <Button
        disabled={loading}
        className="w-full mt-4 bg-gradient-primary text-white hover-glow"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </Button>
    </form>
  );
}
