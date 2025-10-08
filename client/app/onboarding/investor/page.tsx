"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageUploader } from "@/components/onboarding/image-uploader";

export default function InvestorOnboarding() {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  return (
    <form className="space-y-6 animate-in fade-in duration-300">
      <ImageUploader
        label="Upload profile picture"
        onChange={(file) => console.log(file)}
      />
      <Input placeholder="Full Name" required />
      <Input placeholder="Company Name" />
      <Input placeholder="Email Address" type="email" />
      <Textarea placeholder="Tell us what kind of partnership you're interested in" />
      <Button className="w-full mt-4 bg-gradient-primary text-white hover-glow">
        Save & Continue
      </Button>
    </form>
  );
}
