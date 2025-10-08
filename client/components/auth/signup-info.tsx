"use client";

import { motion } from "framer-motion";
import { UserRoleEnum } from "@/server/enums/UserRoleEnum";
import { RoleCard } from "@/components/auth/role-card";

const roles: {
  role: string;
  description: string;
  icon: string;
}[] = [
  {
    role: UserRoleEnum.USER,
    description: "Discover and review restaurants nearby.",
    icon: "🍽️",
  },
  {
    role: UserRoleEnum.BUSINESS,
    description: "Showcase your business and reach more customers.",
    icon: "🏪",
  },
  {
    role: UserRoleEnum.RIDER,
    description: "Join our delivery network and earn on the go.",
    icon: "🚴‍♂️",
  },
  {
    role: UserRoleEnum.INVESTOR,
    description: "Partner with us to grow the food ecosystem.",
    icon: "💼",
  },
];

export default function SignUpInfo({
  setOpenForm,
}: {
  setOpenForm: () => any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-6 px-6"
    >
      {roles.map((r, i) => (
        <RoleCard key={i} {...r} delay={i * 0.1} action={setOpenForm} />
      ))}
    </motion.div>
  );
}
