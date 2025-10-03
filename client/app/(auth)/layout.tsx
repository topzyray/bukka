"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BukkaButton } from "@/components/ui/button-variants";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const router = useRouter();
  return (
    <section className="relative min-h-screen hero-gradient bg-card flex flex-col">
      <header className="p-4">
        <BukkaButton
          variant="link"
          size="sm"
          asChild
          className="absolute cursor-pointer"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </BukkaButton>
      </header>

      <section className="relative flex-1 flex items-center justify-center">
        <section className="w-full max-w-sm">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-24 bg-white flex items-center justify-center mx-auto hover:cursor-pointer"
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
        </section>
      </section>

      <motion.section
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-6xl opacity-50"
      >
        🍽️
      </motion.section>
      <motion.section
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-10 text-5xl opacity-60"
      >
        🍕
      </motion.section>
      <motion.section
        animate={{ x: [0, 20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-20 text-4xl opacity-50"
      >
        🍜
      </motion.section>
    </section>
  );
}
