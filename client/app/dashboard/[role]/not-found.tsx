"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, MapPin, Search } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";

export default function NotFound() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl mb-6"
      >
        🍽️
      </motion.div>

      <h1 className="text-6xl font-bold text-shine mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Oops! Not Found
      </h2>
      {/* <p className="text-muted-foreground mb-8">
        Looks like this page wandered off the menu. Let&apos;s get you back to
        discovering amazing restaurants!
      </p> */}

      <div className="space-y-3">
        <BukkaButton
          variant="hero"
          size="lg"
          asChild
          className="w-full flex items-center justify-center gap-2"
          onClick={() => router.back()}
        >
          <Home className="w-5 h-5" />
          Go Back
        </BukkaButton>

        <BukkaButton variant="outline" size="lg" asChild className="w-full">
          <Link
            href="businesses"
            className="flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Restaurants
          </Link>
        </BukkaButton>

        <BukkaButton variant="ghost" size="lg" asChild className="w-full">
          <Link href="maps" className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Explore Map
          </Link>
        </BukkaButton>
      </div>
    </motion.div>
  );
}
