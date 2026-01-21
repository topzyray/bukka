"use client";

import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@/data/mutations/auth/use-signin";
import { BukkaButton } from "@/components/ui/button-variants";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputComponent } from "../../../components/form-ui/base/input-component";
import { GoogleSignIn } from "./google-sign-in";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signInUser, isSigningIn } = useSignIn();

  const form = useForm<SignInFormData>({
    mode: "onSubmit",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    signInUser(data);
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
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-muted-foreground">
            Sign in to discover amazing restaurants
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
                disabled={isSigningIn}
                icon={Mail}
              />

              <InputComponent
                formControl={form.control}
                formName="password"
                formLabel="Password"
                formInputType="password"
                formPlaceholder="Enter valid password"
                disabled={isSigningIn}
                icon={Lock}
                isPassword
                showPasswordStrength={false}
              />

              <div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary dark:text-foreground hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <BukkaButton
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSigningIn || !form.formState.isValid}
              >
                {isSigningIn ? (
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
                  "Sign In"
                )}
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

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mt-2">
              Didn't receive email verification?{" "}
              <Link
                href="/request-email-verification"
                className="text-primary dark:text-foreground hover:underline font-medium"
              >
                Click Here
              </Link>
            </p>

            <p className="text-sm text-muted-foreground mt-2">
              New to Bukka?{" "}
              <Link
                href="/signup"
                className="text-primary dark:text-foreground hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </section>
    </motion.div>
  );
}
