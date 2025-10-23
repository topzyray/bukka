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
          "border-primary mx-auto h-10 w-10 animate-spin rounded-full border-6 border-dashed",
          rollerClassName
        )}
        {...props}
      ></div>
      <p
        className={cn(
          "mt-1 text-base font-semibold lg:font-semibold capitalize animate-pulse",
          textClassName
        )}
        {...props}
      >
        {text}
      </p>
    </motion.div>
  );
}
