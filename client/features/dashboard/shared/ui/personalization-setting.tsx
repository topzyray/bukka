"use client";

import { useState } from "react";
import { useAuth } from "@/providers";
import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../components/setting-title-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useUserPersonalization } from "@/data/queries/use-personalization";
import { UserPersonalizationCard } from "../components/personalization-card";
import { CreateEditPersonalizationForm } from "../../user/forms/create-edit-personalization";

export function PersonalizationSettings() {
  const [editProfile, setEditProfile] = useState(false);

  const { user } = useAuth();
  const { data: personalization } = useUserPersonalization({
    userId: user?.id,
  });
  const userPersonalizaton = personalization?.responseData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="Personalization Settings"
        description="Manage your food preferences, dietary restrictions, and delivery
          options."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full mx-auto rounded-xl shadow-md border dark:border-sidebar-accent overflow-hidden transition-all hover:shadow-lg">
          {editProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>Update Preferences Form</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateEditPersonalizationForm
                  initialData={userPersonalizaton}
                  isEdit={true}
                  setEditProfile={setEditProfile}
                  onSuccess={() => setEditProfile(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <UserPersonalizationCard
              data={userPersonalizaton}
              setEditProfile={setEditProfile}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
