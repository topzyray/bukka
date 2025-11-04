"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  MapPin,
  Heart,
  Clock,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { BukkaButton } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileCategoryEnum } from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { CircularLoader } from "@/components/loaders/circular-loader";

export function Profile() {
  const { user, logout, userFiles, isLoadingUserFiles } = useAuth();
  const profileAvatar: File | null | undefined =
    !isLoadingUserFiles && userFiles && userFiles.length
      ? userFiles.find(
          (file) => file.category === FileCategoryEnum.USER_PROFILE_IMAGE
        )
      : null;

  const router = useRouter();

  const handleAction = (message: string) => {
    toast("Coming soon", { description: message });
  };
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Profile Header */}
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border border-primary">
                {isLoadingUserFiles ? (
                  <CircularLoader />
                ) : userFiles ? (
                  <Image
                    src={profileAvatar?.fullPath as string}
                    alt={user?.firstName + "profile"}
                    width={96}
                    height={96}
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle className="text-2xl">
                {`${user?.firstName} ${user?.lastName}`}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {user?.favorites ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {userFiles?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Photos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <BukkaButton
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() =>
                router.push(`/dashboard/${user?.role.toLowerCase()}/favorites`)
              }
            >
              <Heart className="w-6 h-6" />
              <span>My Favorites</span>
            </BukkaButton>
            <BukkaButton
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <Clock className="w-6 h-6" />
              <span>Recent Searches</span>
            </BukkaButton>
          </div>

          {/* Settings Menu */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Profile editing coming soon")}
                >
                  <User className="w-4 h-4 mr-3" />
                  Edit Profile
                </BukkaButton>
                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Profile editing coming soon")}
                >
                  <User className="w-4 h-4 mr-3" />
                  Active Sessions
                </BukkaButton>
                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    handleAction("Location preferences coming soon")
                  }
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  Location Preferences
                </BukkaButton>
                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    handleAction("Notification settings coming soon")
                  }
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </BukkaButton>
                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Privacy settings coming soon")}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Privacy & Security
                </BukkaButton>

                <Separator />

                <BukkaButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </BukkaButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
