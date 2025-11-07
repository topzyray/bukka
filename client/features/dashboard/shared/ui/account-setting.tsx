"use client";

import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../components/setting-title-card";
import { PasswordUpdateForm } from "../components/password-update-form";
import { AccountDeletionCard } from "../components/account-deletion-card";

export function AccountSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="Account Settings"
        description=" Manage your login credentials and account details."
      />

      <PasswordUpdateForm />

      <AccountDeletionCard />
    </motion.div>
  );
}
