"use client";

import { CircularLoader } from "@/components/loaders/circular-loader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  SingleFileUploader,
} from "@/components/ui";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
} from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { User } from "@/data/interfaces/User";
import { FileApiService } from "@/data/services";
import { useQueryClient } from "@tanstack/react-query";
import { Shield } from "lucide-react";

interface IProfileAvatar {
  isLoadingUserFiles: boolean;
  profileAvatar: File | null | undefined;
  user: User;
}
export function ProfileAvatar({
  user,
  isLoadingUserFiles,
  profileAvatar,
}: IProfileAvatar) {
  const fullName = `${user?.firstName} ${user?.lastName}`.trim();
  const queryClient = useQueryClient();

  return (
    <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 border-b dark:border-sidebar-accent">
      <Avatar className="w-24 h-24 border border-primary">
        {isLoadingUserFiles ? (
          <CircularLoader />
        ) : profileAvatar ? (
          <AvatarImage
            src={profileAvatar?.fullPath as string}
            alt={user?.firstName + "profile"}
            className="h-full w-full"
          />
        ) : (
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {user?.firstName?.[0].toUpperCase()}{" "}
            {user?.lastName?.[0].toUpperCase()}
          </AvatarFallback>
        )}
        <SingleFileUploader
          title="Upload Profile Avatar"
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
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-foreground">{fullName}</h2>
        <p className="text-muted-foreground font-semibold">@{user?.username}</p>
        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground dark:text-foreground font-semibold">
          <Shield className="w-4 h-4 fill-muted-foreground dark:fill-foreground" />
          <span className="capitalize">{user?.role}</span>
        </div>
      </div>
    </Card>
  );
}
