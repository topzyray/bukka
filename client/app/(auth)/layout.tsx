"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/guards/route-guard";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { BackgroundIcons } from "@/components/ui/background-icons";

interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const router = useRouter();
  return (
    <RouteGuard isProtected={false}>
      <section className="relative min-h-screen flex flex-col">
        <header className="p-4 flex justify-between items-center">
          <section className="absolute top-2 right-0 bg-white dark:bg-primary rounded-full">
            <ThemeToggle />
          </section>
        </header>

        <section className="relative flex-1 flex items-center justify-center px-3">
          <Card className="w-full max-w-md shadow-elegant py-6">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-16 flex items-center justify-center mx-auto hover:cursor-pointer"
              onClick={() => router.push("/")}
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
            {children}
          </Card>
        </section>

        <BackgroundIcons />
      </section>
    </RouteGuard>
  );
}
