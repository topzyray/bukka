"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import Image from "next/image";
import {
  ChevronDown,
  CircleUserRound,
  HelpCircle,
  LogOutIcon,
  LucideMail,
  Settings,
  Ticket,
  UserCircle,
} from "lucide-react";
import { TextHelper } from "@/helpers/text-helper";
import { useRouter } from "next/navigation";
import { User } from "@/server/interfaces/User";
import { useAuth } from "@/providers/auth-provider";
import TooltipComponent from "../ui/tooltip-component";

interface IUserProfileDropdown {
  userData: User;
}

export function UserProfileDropdown({ userData }: IUserProfileDropdown) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton variant="default" size="default" className="py-4">
          {userData && userData !== null && userData.avatar ? (
            <Image
              src={userData?.avatar?.url as string}
              alt={userData.firstName}
              width={30}
              height={30}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUserRound size={35} className="text-primary" />
          )}
          <span className="hidden sm:block">
            {TextHelper.capitalize(userData?.firstName as string)}
          </span>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-full min-w-sm space-y-2 p-4">
        <DropdownMenuItem className="text-sm">
          {userData && userData !== null && userData.avatar ? (
            <Image
              src={userData?.avatar?.url}
              alt={userData.firstName}
              width={35}
              height={35}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUserRound size={35} className="text-primary" />
          )}{" "}
          {userData &&
            userData !== null &&
            `${TextHelper.capitalize(
              userData?.firstName
            )} ${TextHelper.capitalize(userData?.lastName)}`}
        </DropdownMenuItem>
        <TooltipComponent
          trigger={
            <DropdownMenuItem className="overflow-hidden py-2 text-sm text-ellipsis">
              <LucideMail /> {userData && userData !== null && userData.email}
            </DropdownMenuItem>
          }
          message={
            <span>{userData && userData !== null && userData.email}</span>
          }
        />
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/${userData?.role.toLowerCase()}/profile`)
          }
          className="py-2 text-sm"
        >
          <UserCircle /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-sm">
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-sm">
          <Ticket /> Raise a ticket
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-sm">
          <HelpCircle /> Help & Support
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="py-2 text-sm text-red-600"
        >
          <LogOutIcon /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
