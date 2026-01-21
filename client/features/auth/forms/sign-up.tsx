"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { UserRoleEnum } from "@/data/enums";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@/data/mutations/auth/use-signup";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { useGlobalState } from "@/providers/global-state-provider";
import { Processing } from "../../../components/loaders/processing";
import { InputComponent } from "../../../components/form-ui/base/input-component";
import { SelectComponent } from "../../../components/form-ui/base/select-component";
import Image from "next/image";
import { GoogleSignIn } from "./google-sign-in";

const signUpSchema = z.object({
  role: z.enum(UserRoleEnum),
  firstName: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = ({ onBack }: { onBack: () => void }) => {
  const { signupAs } = useGlobalState();

  const form = useForm<SignUpFormData>({
    mode: "onSubmit",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: signupAs as UserRoleEnum,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { signUpUser, isSigningUp } = useSignUp({ resetForm: form.reset });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    // TODE: Change from any later
    signUpUser(data as any);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="space-y-5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary dark:text-foreground">
            Join Bukka
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to start discovering amazing restaurants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* <SelectComponent
                formControl={form.control}
                formName="role"
                formLabel="Role"
                formPlaceholder="Select a role"
                formOptionLabel="I am a"
                formOptionData={[
                  { value: UserRoleEnum.USER, label: "Food Lover (User)" },
                  { value: UserRoleEnum.VENDOR, label: "Restaurant Owner" },
                  { value: UserRoleEnum.RIDER, label: "Dispatch Rider" },
                  { value: UserRoleEnum.INVESTOR, label: "Investor" },
                ]}
                icon={ShieldCheck}
                disabled={true}
              /> */}

              <InputComponent
                formControl={form.control}
                formName="role"
                formLabel="Role"
                formInputType="text"
                formPlaceholder="Your role"
                disabled={isSigningUp}
                icon={User}
                readOnly
              />

              <InputComponent
                formControl={form.control}
                formName="firstName"
                formLabel="First Name"
                formInputType="text"
                formPlaceholder="Enter your first name"
                disabled={isSigningUp}
                icon={User}
              />

              <InputComponent
                formControl={form.control}
                formName="lastName"
                formLabel="Last Name"
                formInputType="text"
                formPlaceholder="Enter your last name"
                disabled={isSigningUp}
                icon={User}
              />

              <InputComponent
                formControl={form.control}
                formName="email"
                formLabel="Email"
                formInputType="email"
                formPlaceholder="Enter valid email"
                disabled={isSigningUp}
                icon={Mail}
              />

              <InputComponent
                formControl={form.control}
                formName="password"
                formLabel="Password"
                formInputType="password"
                formPlaceholder="Enter valid password"
                disabled={isSigningUp}
                icon={Lock}
                isPassword
              />

              <BukkaButton
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isSigningUp || !form.formState.isValid}
              >
                {isSigningUp ? <Processing /> : "Create Account"}
              </BukkaButton>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-muted-foreground" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground dark:text-white">
                Or
              </span>
            </div>
          </div>

          {/* Social Sign In */}
          <GoogleSignIn />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary dark:text-foreground hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
            <Button
              type="button"
              variant="link"
              onClick={onBack}
              className="dark:text-foreground"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </section>
    </motion.div>
  );
};
