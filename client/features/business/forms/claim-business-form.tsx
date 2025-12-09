"use client";

import { useState } from "react";
import { BukkaButton, Input, Label, Textarea } from "@/components/ui";

export function ClaimPageForm() {
  const [phone, setPhone] = useState("");
  const [doc, setDoc] = useState<File | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <Input
          placeholder="Enter your business phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Ownership Document (optional)</Label>
        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setDoc(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-muted-foreground">
          Upload a business license, utility bill, or any document showing proof
          of ownership.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Additional Notes (optional)</Label>
        <Textarea
          placeholder="Anything you'd like our team to know?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <BukkaButton className="w-full" variant="glow">
        Submit Verification
      </BukkaButton>
    </div>
  );
}
