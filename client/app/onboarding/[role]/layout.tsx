"use client";

import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { BackgroundIcons } from "@/components/ui/background-icons";
import { OnboardingGuard } from "@/guards/onboarding-guard";
import { getAllowedRoutesForRole } from "@/utils/route-access-utils";
import { UserRoleEnum } from "@/server/enums";
import { useRouter, usePathname, redirect } from "next/navigation";
import { UserRole } from "@/server/interfaces/Auth";

interface IOnboardingLayout {
  children: ReactNode;
  params: Promise<{ role: string }>;
}

export default function RoleBasedOnboardingLayout({
  children,
  params,
}: IOnboardingLayout) {
  const { logout, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const unwrappedParams = React.use(params);
  const currentRole = unwrappedParams.role.toLowerCase() as UserRoleEnum;

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (!user) {
  //     console.log("INSIDE ONBOARDING LAYOUT: ", user);
  //     router.replace("/signin");
  //     return;
  //   }

  //   const userRole = user.role.toLowerCase();
  //   const allowedRoutes = getAllowedRoutesForRole(userRole as UserRoleEnum);
  //   const isRoleMismatch = userRole !== currentRole;
  //   const isNotAllowed = !allowedRoutes.some((route) =>
  //     pathname.startsWith(route)
  //   );

  //   if (isRoleMismatch || isNotAllowed) {
  //     router.replace(`/onboarding/${userRole}`);
  //   }
  // }, [isLoading, user, currentRole, pathname, router]);

  // if (isLoading || !user) return null;

  // const userRole = user?.role.toLowerCase();
  // if (userRole !== currentRole) return;
  // if (!user) {
  //   redirect("/signin");
  // }

  return (
    <OnboardingGuard roles={[user?.role.toLowerCase() as UserRole]}>
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-primary p-4 sm:p-6 overflow-hidden">
        {/* Logout Button */}
        <div className="absolute top-3 right-3 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Main Card */}
        <motion.section
          className="w-full max-w-5xl h-[75vh] bg-card text-card-foreground rounded-2xl shadow-elegant overflow-hidden flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Section: Form / Content */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-2 sm:px-8 py-8">
              {/* Mobile Logo */}
              <div className="md:hidden flex justify-center mb-6">
                <Link href="/" className="hover:scale-105 transition-transform">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-32 h-12 relative"
                  >
                    <Image
                      src="/images/bukka.png"
                      alt="Bukka Logo"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-shine mb-3 text-center md:text-left">
                Complete Your Profile
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 text-center md:text-left">
                Let’s personalize your experience — this helps us serve you
                better.
              </p>

              <div className="flex justify-center md:justify-start">
                <div className="w-full max-w-md">{children}</div>
              </div>
            </div>
          </section>

          {/* Right Section: Illustration */}
          <motion.section
            className="hidden md:flex w-[50%] flex-col justify-center items-center bg-muted/30 p-8 border-l border-border relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <div className="">
              <Link href="/" className="hover:scale-105 transition-transform">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-44 h-16 relative"
                >
                  <Image
                    src="/images/bukka.png"
                    alt="Bukka Logo"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </Link>
            </div>

            <div className="w-full max-w-[380px] flex items-center justify-center mt-8">
              <Image
                src="/images/onboarding-illustration-deep.png"
                alt="Onboarding illustration"
                width={380}
                height={380}
                className="w-full h-auto object-contain drop-shadow-xl"
                priority
              />
            </div>
          </motion.section>
        </motion.section>

        <BackgroundIcons />
      </section>
    </OnboardingGuard>
  );
}
