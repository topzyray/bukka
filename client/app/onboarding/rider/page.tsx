"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageUploader } from "@/components/onboarding/image-uploader";

export default function RiderOnboarding() {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  return (
    <form className="space-y-6 animate-in fade-in duration-300">
      <ImageUploader
        label="Upload profile picture"
        onChange={(file) => console.log(file)}
      />
      <Input placeholder="Full Name" required />
      <Input placeholder="Phone Number" required />
      <Input placeholder="Vehicle Type (e.g. Bike, Car)" required />
      <Input placeholder="License Number" />
      <Button className="w-full mt-4 bg-gradient-primary text-white hover-glow">
        Save & Continue
      </Button>
    </form>
  );
}
