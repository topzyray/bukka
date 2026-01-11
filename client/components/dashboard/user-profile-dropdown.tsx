"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import {
  ChevronDown,
  HelpCircle,
  Loader2,
  LogOutIcon,
  LucideMail,
  Settings,
  Ticket,
  UserCircle,
} from "lucide-react";
import { TextHelper } from "@/helpers/text-helper";
import { useRouter } from "next/navigation";
import { User } from "@/data/interfaces/User";
import { useAuth } from "@/providers/auth-provider";
import TooltipComponent from "../ui/tooltip-component";
import { FileCategoryEnum } from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui";

interface IUserProfileDropdown {
  userData: User;
}

export function UserProfileDropdown({ userData }: IUserProfileDropdown) {
  const { logout, userFiles, isLoadingUserFiles } = useAuth();
  const profileAvatar: File | null | undefined =
    !isLoadingUserFiles && userFiles && userFiles.length
      ? userFiles.find(
          (file) => file.category === FileCategoryEnum.USER_PROFILE_IMAGE
        )
      : null;
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton variant="default" size="default">
          <Avatar className="w-6 h-6 border border-primary dark:border-foreground flex justify-center items-center">
            {isLoadingUserFiles ? (
              <div>
                <span>
                  <Loader2 className="animate-spin" />
                </span>
              </div>
            ) : userFiles ? (
              <AvatarImage
                src={profileAvatar?.fullPath as string}
                alt={userData?.firstName + "profile"}
                width={30}
                height={30}
                className="bg-center"
              />
            ) : (
              <AvatarFallback className="text-xs text-foreground dark:text-foreground">
                {userData?.firstName?.[0].toUpperCase()}
                {userData?.lastName?.[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <span className="hidden sm:block">
            {TextHelper.capitalize(userData?.firstName as string)}
          </span>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-full min-w-sm space-y-2 p-4">
        <DropdownMenuItem className="text-sm">
          <Avatar className="w-5 h-5 border border-primary dark:border-muted-foreground flex justify-center items-center">
            {isLoadingUserFiles ? (
              <div>
                <span>
                  <Loader2 className="animate-spin" />
                </span>
              </div>
            ) : !userFiles ? (
              <AvatarImage
                src={profileAvatar?.fullPath as string}
                alt={userData?.firstName + "profile"}
                width={35}
                height={35}
                className="bg-center"
              />
            ) : (
              <AvatarFallback className="text-[10px] text-foreground dark:text-muted-foreground">
                {userData?.firstName?.[0].toUpperCase()}
                {userData?.lastName?.[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {userData &&
            userData !== null &&
            `${TextHelper.capitalize(
              userData?.firstName
            )} ${TextHelper.capitalize(userData?.lastName)}`}
        </DropdownMenuItem>
        <TooltipComponent
          trigger={
            <DropdownMenuItem className="overflow-hidden py-2 text-sm text-ellipsis">
              <LucideMail /> {userData && userData !== null && userData?.email}
            </DropdownMenuItem>
          }
          message={
            <span>{userData && userData !== null && userData?.email}</span>
          }
        />
        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/dashboard/${userData?.role.toLowerCase()}/settings/profile`
            )
          }
          className="py-2 text-sm"
        >
          <UserCircle /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/${userData?.role.toLowerCase()}/settings`)
          }
          className="py-2 text-sm"
        >
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/${userData?.role.toLowerCase()}/tickets`)
          }
          className="py-2 text-sm"
        >
          <Ticket /> Raise a ticket
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-sm">
          <HelpCircle /> Help & Support
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="py-2 text-sm">
          <LogOutIcon /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
