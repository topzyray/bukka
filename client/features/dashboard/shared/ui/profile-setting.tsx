"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers";
import { motion } from "framer-motion";
import { UserProfileCard } from "../components/profile-card";
import { User } from "@/data/interfaces/User";
import { ProfileUpdateForm } from "../forms/profile-update-form";
import { File } from "@/data/interfaces/File";
import { FileCategoryEnum } from "@/data/enums";
import { ProfileAvatar } from "../components/profile-avatar";
import { Card, Label } from "@/components/ui";
import { Briefcase, FileIcon, Heart, Laptop, Pen } from "lucide-react";
import { SettingsPageTitleCard } from "../components/setting-title-card";
import { useUserActivitySummary } from "@/data/queries/use-analytics-query";

export function ProfileSettings() {
  const [editProfile, setEditProfile] = useState(false);

  const { user } = useAuth();

  const { data: activitiesSummaryData } = useUserActivitySummary({
    userId: user?.id as number,
  });
  const activitiesSummary = activitiesSummaryData?.responseData;

  const { userFiles, isLoadingUserFiles } = useAuth();
  const profileAvatar: File | null | undefined =
    !isLoadingUserFiles && userFiles && userFiles.length
      ? userFiles.find(
          (file) => file.category === FileCategoryEnum.USER_PROFILE_IMAGE
        )
      : null;

  const stats = [
    {
      icon: Briefcase,
      title: "Businesses",
      count: activitiesSummary?.businesses,
    },
    {
      icon: Heart,
      title: "Favourites",
      count: activitiesSummary?.favorites,
    },
    { icon: Pen, title: "Reviews", count: activitiesSummary?.reviews },
    { icon: FileIcon, title: "Files", count: activitiesSummary?.files },
    {
      icon: Laptop,
      title: "Sessions",
      count: activitiesSummary?.sessions,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="Profile Information"
        description="View and update your user information.."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full mx-auto rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
          <ProfileAvatar
            user={user as User}
            isLoadingUserFiles={isLoadingUserFiles}
            profileAvatar={profileAvatar}
          />

          {editProfile ? (
            <ProfileUpdateForm
              user={user as User}
              setEditProfile={setEditProfile}
            />
          ) : (
            <UserProfileCard
              user={user as User}
              setEditProfile={setEditProfile}
            />
          )}
        </div>

        <div className="lg:max-w-md w-full h-full">
          <Card className="w-full mx-auto rounded-xl shadow-md border dark:border-sidebar-accent overflow-hidden transition-all hover:shadow-lg py-6">
            <div className="px-6 mb-4">
              <Label className="font-semibold text-base">User Activities</Label>
            </div>
            <div className="text-center grid grid-cols-2 gap-3 px-6">
              {stats?.length &&
                stats?.map((stat) => (
                  <div
                    key={stat.title}
                    className="flex flex-col justify-center items-center border dark:border-sidebar-accent rounded-lg p-4"
                  >
                    <stat.icon size={16} />
                    <Label className="text-lg">{stat.title}</Label>
                    <div>
                      <p className="text-2xl font-semibold">{stat.count}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
