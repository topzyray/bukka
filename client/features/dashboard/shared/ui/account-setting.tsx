"use client";

import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../components/setting-title-card";

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

      <div className="space-y-4">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </motion.div>
  );
}
