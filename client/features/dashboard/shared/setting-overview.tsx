"use client";

import {
  User,
  Settings,
  MapPin,
  Heart,
  Clock,
  Shield,
  Bell,
  LogOut,
  Pen,
  FileIcon,
  Laptop,
  Briefcase,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  BukkaButton,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  SmartFileUploader,
} from "@/components/ui";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
  UserRoleEnum,
} from "@/data/enums";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { File } from "@/data/interfaces/File";
import { FileApiService } from "@/data/services";
import { useAuth } from "@/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { SettingsPageTitleCard } from "./components/setting-title-card";
import { useUserActivitySummary } from "@/data/queries/use-analytics-query";

export function SettingsOverview() {
  const queryClient = useQueryClient();
  const { user, logout, userFiles, isLoadingUserFiles } = useAuth();
  const profileAvatar: File | null | undefined =
    !isLoadingUserFiles && userFiles && userFiles.length
      ? userFiles.find(
          (file) => file.category === FileCategoryEnum.USER_PROFILE_IMAGE
        )
      : null;

  const { data: activitiesSummaryData } = useUserActivitySummary({
    userId: user?.id as number,
  });
  const activitiesSummary = activitiesSummaryData?.responseData;

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

  const router = useRouter();

  const handleAction = (message: string) => {
    toast("Coming soon", { description: message });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <SettingsPageTitleCard
        title="Profile Overview"
        description="View summary and navigate to other setting page."
      />

      <Card className="shadow-card py-6 lg:py-10">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border border-primary flex justify-center items-center">
            {isLoadingUserFiles ? (
              <CircularLoader />
            ) : userFiles ? (
              <AvatarImage
                src={profileAvatar?.fullPath as string}
                alt={user?.firstName + "profile"}
                width={96}
                height={96}
                className="bg-center"
              />
            ) : (
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.firstName?.[0].toUpperCase()}{" "}
                {user?.lastName?.[0].toUpperCase()}
              </AvatarFallback>
            )}
            <SmartFileUploader
              title="Upload Profile Avatar"
              useCameraModal
              uploadFn={FileApiService.uploadFile}
              extraParams={{
                referenceType: FileReferenceTypeEnum.USER,
                category: FileCategoryEnum.USER_PROFILE_IMAGE,
                referenceId: user?.id,
                isPublic: true,
                metadata: {
                  altText: `${user?.firstName} ${user?.lastName} - Profile Photo`,
                },
              }}
              onUploadSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: [QueryKeyEnum.CURRENT_USER],
                });
                queryClient.invalidateQueries({
                  queryKey: [QueryKeyEnum.USER_FILES],
                });
                queryClient.invalidateQueries({
                  queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
                });
                queryClient.invalidateQueries({
                  queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
                });
              }}
            />
          </Avatar>
          <CardTitle className="text-2xl">
            {`${user?.firstName} ${user?.lastName}`}
          </CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-4">
          <div className="flex flex-wrap justify-evenly gap-6 text-center flex-1">
            {stats?.length &&
              stats?.map((stat) => (
                <div
                  key={stat.title}
                  className="border p-4 rounded-lg max-w-sm w-full sm:w-[9.5rem]"
                >
                  <div className="text-2xl font-bold text-primary dark:text-foreground flex-1">
                    {stat.count}
                  </div>
                  <div className="text-sm text-muted-foreground flex justify-center items-center gap-2">
                    <stat.icon size={15} /> {stat.title}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {user?.role === UserRoleEnum.USER && (
        <div className="grid grid-cols-2 gap-4">
          <BukkaButton
            variant="outline"
            className="h-auto p-4 flex-col gap-2"
            onClick={() =>
              router.push(`/dashboard/${user?.role.toLowerCase()}/favourites`)
            }
          >
            <Heart className="w-6 h-6" />
            <span>My Favorites</span>
          </BukkaButton>
          <BukkaButton variant="outline" className="h-auto p-4 flex-col gap-2">
            <Clock className="w-6 h-6" />
            <span>Recent Searches</span>
          </BukkaButton>
        </div>
      )}

      <Card className="shadow-card py-6 lg:py-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push(`settings/profile`)}
            >
              <User className="w-4 h-4 mr-3" />
              My Profile
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push(`settings/personalization`)}
            >
              <User className="w-4 h-4 mr-3" />
              My Personalization
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push(`settings/sessions`)}
            >
              <User className="w-4 h-4 mr-3" />
              Sessions
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleAction("Location preferences coming soon")}
            >
              <MapPin className="w-4 h-4 mr-3" />
              Location Preferences
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push(`notifications`)}
            >
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              className="w-full justify-start"
              // onClick={() => router.push(`settings/privacy`)}
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
  );
}
