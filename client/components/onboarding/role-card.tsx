"use client";

import { motion } from "framer-motion";

interface IRoleCardProps {
  role: string;
  description: string;
  icon: string;
  delay?: number;
}

export function RoleCard({
  role,
  description,
  icon,
  delay = 0,
}: IRoleCardProps) {
  return (
    <motion.section
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, delay }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ delay }}
      className="p-6 bg-muted/30 rounded-xl border hover-lift cursor-pointer"
    >
      <section className="text-4xl mb-4">{icon}</section>
      <h3 className="font-semibold text-lg mb-2">{role}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.section>
  );
}
