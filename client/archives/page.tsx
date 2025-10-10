"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UserRoleEnum } from "@/server/enums";
import { RoleCard } from "@/components/onboarding/role-card";

const roles = [
  {
    role: UserRoleEnum.USER,
    link: "/onboarding/user",
    description: "Discover and review restaurants nearby.",
    icon: "🍽️",
  },
  {
    role: UserRoleEnum.BUSINESS,
    link: "/onboarding/business",
    description: "Showcase your business and reach more customers.",
    icon: "🏪",
  },
  {
    role: UserRoleEnum.RIDER,
    link: "/onboarding/rider",
    description: "Join our delivery network and earn on the go.",
    icon: "🚴‍♂️",
  },
  {
    role: UserRoleEnum.INVESTOR,
    link: "/onboarding/investor",
    description: "Partner with us to grow the food ecosystem.",
    icon: "💼",
  },
];

export default function RoleSelector() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {roles.map((r, i) => (
        <Link key={r.role} href={r.link}>
          <RoleCard {...r} delay={i * 0.1} />
        </Link>
      ))}
    </motion.div>
  );
}
