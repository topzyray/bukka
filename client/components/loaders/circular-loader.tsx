"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ICircularLoader {
  text?: string;
  textClassName?: string;
  rollerClassName?: string;
  parentClassName?: string;
}

export function CircularLoader({
  text,
  textClassName,
  rollerClassName,
  parentClassName,
  ...props
}: ICircularLoader) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={cn("text-center", parentClassName)}
      {...props}
    >
      <div
        className={cn(
          "border-amber-950 mx-auto h-12 w-12 animate-spin rounded-full border-8 border-dashed",
          rollerClassName
        )}
        {...props}
      ></div>
      <p
        className={cn(
          "mt-4 text-base font-semibold lg:text-xl lg:font-semibold",
          textClassName
        )}
        {...props}
      >
        {text}
      </p>
    </motion.div>
  );
}
