"use client";

import SignUpInfo from "@/features/auth/components/signup-info";
import { SignUpForm } from "@/features/auth/forms/sign-up";
import { useState } from "react";

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
