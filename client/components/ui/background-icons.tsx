"use client";

import { motion } from "framer-motion";

export function BackgroundIcons() {
  return (
    <>
      {" "}
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
        className="absolute bottom-20 right-10 text-5xl opacity-30"
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
        className="absolute top-1/2 right-20 text-4xl opacity-30"
      >
        🍜
      </motion.section>
    </>
  );
}
