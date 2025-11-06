"use client";

import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../components/setting-title-card";

export function PrivacySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="Privacy Settings"
        description="Control who can see your data and manage data sharing preferences."
      />

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-primary" /> Allow others to
          see my profile
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-primary" /> Share anonymized
          usage data
        </label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Save Changes
      </button>
    </motion.div>
  );
}
