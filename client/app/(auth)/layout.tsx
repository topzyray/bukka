"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BukkaButton } from "@/components/ui/button-variants";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RouteGuard } from "@/guards/route-guard";
import { BackgroundIcons } from "@/components/ui/background-icons";
import { useRouter } from "next/navigation";

interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const router = useRouter();
  return (
    <RouteGuard isProtected={false}>
      <section className="relative min-h-screen hero-gradient bg-card flex flex-col">
        <header className="p-4">
          <BukkaButton
            variant="link"
            size="sm"
            asChild
            className="absolute cursor-pointer text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </BukkaButton>
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
