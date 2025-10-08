"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { RouteGuard } from "@/guards/route-guard";
import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@/server/interfaces/Auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { BackgroundIcons } from "@/components/ui/background-icons";

interface IOnboardingLayout {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: IOnboardingLayout) {
  const { userDetails, logout } = useAuth();
  return (
    <RouteGuard isProtected={true} roles={[userDetails?.role as UserRole]}>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-primary p-6">
        <div className="fixed top-1 right-1">
          <Button variant="outline" onClick={() => logout()}>
            <LogOut />
            Logout
          </Button>
        </div>

        {/* Outer card: fixed height, no scrolling here */}
        <motion.section
          className="w-full max-w-4xl h-[70vh] bg-card text-card-foreground rounded-2xl shadow-elegant overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Important: h-full + min-h-0 so children can shrink and scroll */}
          <section className="p-2 flex flex-col md:flex-row md:gap-0 h-full min-h-0">
            {/* LEFT: scrollable form side */}
            <section className="flex-1 md:w-1/2 min-h-0 overflow-y-auto p-6">
              {/* mobile logo */}
              <section className="md:hidden mb-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2 hover-scale"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer"
                  >
                    <Image
                      src="/images/bukka.png"
                      alt="Logo"
                      width={180}
                      height={38}
                      priority
                      className="w-full h-full"
                    />
                  </motion.div>
                </Link>
              </section>

              <section className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-semibold text-shine mb-4">
                  Complete Your Profile
                </h1>
                <p className="text-muted-foreground mb-6">
                  Let’s personalize your experience on our platform. This helps
                  us serve you better.
                </p>

                {/* <-- This content will scroll if it overflows */}
                {children}
              </section>
            </section>

            {/* RIGHT: static image side (no scrolling) */}
            <motion.section
              className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <section>
                <Link
                  href="/"
                  className="flex items-center space-x-2 hover-scale"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer"
                  >
                    <Image
                      src="/images/bukka.png"
                      alt="Logo"
                      width={180}
                      height={38}
                      priority
                      className="w-full h-full"
                    />
                  </motion.div>
                </Link>
              </section>

              <div className="w-full max-w-[400px] flex items-center justify-center">
                <Image
                  src="/images/onboarding-illustration-deep.png"
                  alt="Onboarding illustration"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain drop-shadow-xl"
                />
              </div>
            </motion.section>
          </section>
        </motion.section>

        <BackgroundIcons />
      </section>
    </RouteGuard>
  );
}
