import { CircularLoader } from "@/components/loaders/circular-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { File } from "@/data/interfaces/File";
import { User } from "@/data/interfaces/User";
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

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 border-b dark:border-sidebar-accent">
      <Avatar className="w-20 h-20 border border-primary">
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
      </Avatar>
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-foreground">{fullName}</h2>
        <p className="text-muted-foreground">@{user?.username}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-foreground">
          <Shield className="w-4 h-4" />
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
}
