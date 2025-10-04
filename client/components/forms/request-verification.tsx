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
import { Form } from "../ui/form";
import Link from "next/link";
import InputComponent from "./base/input-component";
import { useForgotPassword } from "@/api/hooks/auth/use-forgotpassword.hook";

const requestAccountSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

type RequestAccountFormData = z.infer<typeof requestAccountSchema>;

export function RequestAccountVerificationForm() {
  const { submitForgotPassord, submitingRequest } = useForgotPassword();

  const form = useForm<RequestAccountFormData>({
    mode: "all",
    resolver: zodResolver(requestAccountSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof requestAccountSchema>) {
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
          <CardTitle className="text-2xl font-bold">
            Request Email Verification
          </CardTitle>
          <p className="text-muted-foreground">
            You can request a new email verification below if you didn&apos;t
            get an email earlier
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
                  "Submit Request"
                )}
              </BukkaButton>
            </form>
          </Form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have token?{" "}
              <Link
                href="/reset-password"
                className="text-primary hover:underline font-medium"
              >
                Click here
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Already have verified?{" "}
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Signin
              </Link>
            </p>
          </div>
        </CardContent>
      </section>
    </motion.div>
  );
}
