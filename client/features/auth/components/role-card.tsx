"use client";

import { useGlobalState } from "@/providers/global-state-provider";
import { UserRoleEnum } from "@/data/enums";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface IRoleCardProps {
  action: () => any;
  role: string;
  description: string;
  icon: string;
  delay?: number;
}

export function RoleCard({
  action,
  role,
  description,
  icon,
  delay = 0,
}: IRoleCardProps) {
  const { setSignUpAs } = useGlobalState();
  return (
    <motion.section
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, delay }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 bg-muted/30 rounded-xl border dark:border-muted-foreground hover-lift cursor-pointer",
        [UserRoleEnum.RIDER, UserRoleEnum.INVESTOR].includes(
          role as UserRoleEnum
        ) && "pointer-events-none"
      )}
      onClick={() => {
        setSignUpAs(role as UserRoleEnum);
        action();
      }}
      title={
        [UserRoleEnum.RIDER, UserRoleEnum.INVESTOR].includes(
          role as UserRoleEnum
        )
          ? "Coming Soon"
          : "Click To Signup"
      }
    >
      {[UserRoleEnum.RIDER, UserRoleEnum.INVESTOR].includes(
        role as UserRoleEnum
      ) && (
        <Badge className="text-xs mb-1 py-0.2 px-1">Feature Coming Soon</Badge>
      )}
      <section className="text-4xl mb-4">{icon}</section>
      <h3 className="font-semibold text-lg mb-2">{role}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.section>
  );
}
