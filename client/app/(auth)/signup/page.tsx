"use client";

import SignUpInfo from "@/components/auth/signup-info";
import { SignUpForm } from "@/components/forms/sign-up";
import { useState } from "react";

export default function SignUp() {
  const [openForm, setOpenForm] = useState(false);
  return (
    <>
      {openForm ? (
        <SignUpForm />
      ) : (
        <SignUpInfo setOpenForm={() => setOpenForm(true)} />
      )}
    </>
  );
}
