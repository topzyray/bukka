"use client";

import { useRouter } from "next/navigation";
import { BukkaButton } from "./button-variants";
import { ArrowBigLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <BukkaButton
      variant="link"
      size="sm"
      onClick={() => router.back()}
      className="dark:text-foreground"
    >
      <ArrowBigLeft />
      Back
    </BukkaButton>
  );
}
