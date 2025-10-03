"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BukkaButton } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import InputComponent from "./base/input-component";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Processing } from "../loaders/processing";
import SelectComponent from "./base/select-component";
import { Form } from "../ui/form";
import { useSignUp } from "@/api/hooks/auth/use-signup.hook";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
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
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    role: z.enum([
      "user",
      "restaurant",
      "dispatch_rider",
      "investor",
      "business_owner",
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const { signUpUser, isSigningUp } = useSignUp();

  const form = useForm<SignUpFormData>({
    mode: "all",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      role: undefined,
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    signUpUser(data);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Join Bukka
          </CardTitle>
          <CardDescription className="text-primary/80">
            Create your account to start discovering amazing restaurants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputComponent
                formControl={form.control}
                formName="fistName"
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

              <SelectComponent
                formControl={form.control}
                formName="role"
                formLabel="Role"
                formPlaceholder="Select a role"
                formOptionLabel="I am a"
                formOptionData={[
                  { value: "user", label: "Food Lover (User)" },
                  { value: "restaurant", label: "Restaurant Owner" },
                  { value: "dispatch_rider", label: "Dispatch Rider" },
                  { value: "investor", label: "Investor" },
                  { value: "business_owner", label: "Business Owner" },
                ]}
                icon={ShieldCheck}
                disabled={isSigningUp}
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

              {/* <InputComponent
                formControl={form.control}
                formName="confirmPassord"
                formLabel="Confirm Password"
                formInputType="password"
                formPlaceholder="Confirm your password"
                disabled={isSigningUp}
                icon={Lock}
                isPassword
                isConfirmPassword
              /> */}

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

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
