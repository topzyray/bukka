"use client";

import { useState } from "react";
import { SignUpForm } from "@/features/auth/forms/sign-up";
import { SignUpInfo } from "@/features/auth/components/signup-info";

export default function SignUp() {
  const [openForm, setOpenForm] = useState(false);
  return (
    <>
      {openForm ? (
        <SignUpForm onBack={() => setOpenForm(false)} />
      ) : (
        <SignUpInfo setOpenForm={() => setOpenForm(true)} />
      )}
    </>
  );
}
