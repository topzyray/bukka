"use client";

import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BukkaButton } from "@/components/ui/button-variants";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpInputComponent } from "../../../components/form-ui/base/otp-component";
import { useAccountVerification } from "@/data/mutations/auth/use-accountverification";

const accountVerificationSchema = z.object({
  token: z
    .string()
    .min(6, {
      message: "OTP is required",
    })
    .regex(/^\d{6}$/, {
      message: "OTP must consist of exactly 6 digits",
    }),
});

type AccountVerificationFormData = z.infer<typeof accountVerificationSchema>;

export function AccountVerificationForm() {
  const form = useForm<AccountVerificationFormData>({
    mode: "onSubmit",
    resolver: zodResolver(accountVerificationSchema),
    defaultValues: {
      token: "",
    },
  });

  const token = form.watch("token");

  const { verifyNewUser, isVerifyingUser } = useAccountVerification({
    resetForm: form.reset,
  });

  async function onSubmit(data: z.infer<typeof accountVerificationSchema>) {
    verifyNewUser(data.token);
  }

  const handleAutoTriggerUserVerification = useCallback(
    (data: z.infer<typeof accountVerificationSchema>) => {
      verifyNewUser(data.token);
    },
    [, verifyNewUser]
  );

  useEffect(() => {
    if (token.length == 6) {
      setTimeout(
        form.handleSubmit(
          async (data: z.infer<typeof accountVerificationSchema>) => {
            handleAutoTriggerUserVerification(data);
          }
        )
      );
    }
  }, [token, form, verifyNewUser, handleAutoTriggerUserVerification]);

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
            Verify Your Account
          </CardTitle>
          <p className="text-muted-foreground">
            Input the token you received in your email to verify your account
            now
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <OtpInputComponent
                formControl={form.control}
                formName="token"
                formLabel="Verification token"
                disabled={isVerifyingUser}
                autoFocus
                description="Please enter the 6-digit token sent to your email to continue."
              />

              <BukkaButton
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isVerifyingUser || !form.formState.isValid}
              >
                {isVerifyingUser ? (
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

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Request new email verification token{" "}
              <Link
                href="/request-email-verification"
                className="text-primary dark:text-foreground hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Here
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Already verified?{" "}
              <Link
                href="/signin"
                className="text-primary dark:text-foreground hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
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
