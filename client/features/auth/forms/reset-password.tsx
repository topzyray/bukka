"use client";

import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BukkaButton } from "@/components/ui/button-variants";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPassword } from "@/data/mutations/auth/use-resetpassword";
import { InputComponent } from "../../../components/form-ui/base/input-component";
import { OtpInputComponent } from "../../../components/form-ui/base/otp-component";

const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(6, {
      message: "OTP is required",
    })
    .regex(/^\d{6}$/, {
      message: "OTP must consist of exactly 6 digits",
    }),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormData>({
    mode: "onSubmit",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
    },
  });

  const token = form.watch("token");

  const { processResetPassword, isProcessingResetPassword } = useResetPassword({
    resetForm: form.reset,
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    processResetPassword(data);
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
            Reset Your Password
          </CardTitle>
          <p className="text-muted-foreground">
            Input the token you received and your new password below
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <OtpInputComponent
                formControl={form.control}
                formName="token"
                formLabel="One-Time Password"
                disabled={isProcessingResetPassword}
                autoFocus
                description="Please enter the one-time password sent to your email to continue."
              />

              {token.length == 6 && (
                <>
                  <InputComponent
                    formControl={form.control}
                    formName="newPassword"
                    formLabel="New Password"
                    formInputType="password"
                    formPlaceholder="Enter your new password"
                    disabled={isProcessingResetPassword}
                    isPassword
                    icon={Lock}
                  />

                  <BukkaButton
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={
                      isProcessingResetPassword || !form.formState.isValid
                    }
                  >
                    {isProcessingResetPassword ? (
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
                </>
              )}
            </form>
          </Form>
        </CardContent>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive password reset token?{" "}
            <Link
              href="/forgot-password"
              className="text-primary dark:text-foreground hover:underline font-medium"
            >
              Click Here
            </Link>
          </p>

          <p className="text-sm text-muted-foreground">
            Password reset successful?{" "}
            <Link
              href="/signin"
              className="text-primary dark:text-foreground hover:underline font-medium"
            >
              Signin
            </Link>
          </p>
        </div>
      </section>
    </motion.div>
  );
}
