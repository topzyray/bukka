"use client";

import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../shared/components/setting-title-card";
import { BukkaButton, Card, CardContent } from "@/components/ui";
import { useClearAllCache } from "@/data/mutations/admin/control";
import { Loader2 } from "lucide-react";

export function SystemSettings() {
  const clearAllMutationMutation = useClearAllCache({});
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="System Settings"
        description="Manage system settings for admin"
      />

      <Card>
        <CardContent>
          <BukkaButton
            onClick={() => clearAllMutationMutation.mutate()}
            disabled={clearAllMutationMutation.isPending}
          >
            {clearAllMutationMutation.isPending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="animate-spin" />
                Clearing Cache
              </span>
            ) : (
              "Clear All Cache"
            )}
          </BukkaButton>
        </CardContent>
      </Card>
    </motion.div>
  );
}
