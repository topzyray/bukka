"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Form } from "../../../components/ui/form";
import Link from "next/link";
import { InputComponent } from "../../../components/form-ui/base/input-component";
import { useForgotPassword } from "@/data/mutations/auth/use-forgotpassword";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { submitForgotPassord, submitingRequest } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    mode: "all",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    submitForgotPassord(data);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("w-full max-w-md mx-auto")}
    >
      <section className="space-y-5">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <p className="text-muted-foreground">
            If you forgot your password, do not pannick, submit a reset request
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputComponent
                formControl={form.control}
                formName="email"
                formLabel="Email"
                formInputType="email"
                formPlaceholder="Enter valid email"
                disabled={submitingRequest}
                icon={Mail}
              />

              <BukkaButton
                type="submit"
                variant="hero"
                className="w-full"
                disabled={submitingRequest || !form.formState.isValid}
              >
                {submitingRequest ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Request Passowrd Reset"
                )}
              </BukkaButton>
            </form>
          </Form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already received reset email, click{" "}
              <Link
                href="/reset-password"
                className="text-primary hover:underline font-medium"
              >
                here
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Back to Signin
              </Link>
            </p>
          </div>
        </CardContent>
      </section>
    </motion.div>
  );
}
