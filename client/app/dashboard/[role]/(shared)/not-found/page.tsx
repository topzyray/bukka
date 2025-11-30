"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, MapPin } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";

export default function CatchAllRoutes() {
  const router = useRouter();
  const { role } = useParams() as { role: string };
  return (
    <section className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mt-4 lg:mt-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl lg:text-8xl mb-6"
        >
          🍽️
        </motion.div>

        <h1 className="text-4xl lg:text-6xl font-bold text-shine mb-4">404</h1>
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2 capitalize">
          {role} Dashboard Page Not Found
        </h2>

        <div className="space-y-3">
          <BukkaButton
            variant="hero"
            asChild
            className="w-full flex items-center justify-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </BukkaButton>

          <BukkaButton variant="outline" asChild className="w-full">
            <Link
              href={`/dashboard/${role}/overview`}
              className="flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </BukkaButton>

          <BukkaButton variant="float" asChild className="w-full">
            <Link
              href="maps"
              className="flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Explore Map
            </Link>
          </BukkaButton>
        </div>
      </motion.div>
    </section>
  );
}
