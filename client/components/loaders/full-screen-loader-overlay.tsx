"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface FullscreenLoaderOverlayProps {
  show: boolean;
  label?: string;
}

export function FullscreenLoaderOverlay({
  show,
  label = "Saving...",
}: FullscreenLoaderOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-black/40 backdrop-blur-xs",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center gap-3 bg-background px-6 py-5 rounded-xl shadow-xl"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
