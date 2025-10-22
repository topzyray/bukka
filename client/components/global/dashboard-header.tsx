import { CustomTrigger } from "./custom-trigger";
import { Label } from "../ui/label";
import { ThemeToggle } from "../atoms/mode-toggle";
import { Notifications } from "../atoms/notifications";
import { User } from "@/server/interfaces/User";
import { UserProfileDropdown } from "../atoms/user-profile-dropdown";
import { DashboardTitleEnum } from "@/server/enums";

interface DashboardHeader {
  dashboardTitle: DashboardTitleEnum;
  userData: User;
}

export function DashboardHeader({ dashboardTitle, userData }: DashboardHeader) {
  return (
    <header className="bg-sidebar text-sidebar-foreground fixed top-0 z-50 flex w-full items-center justify-between border px-2 py-2 sm:px-4">
      <section className="flex items-center gap-2">
        <CustomTrigger />
        <section className="flex items-center gap-2">
          <section className="flex flex-col">
            <Label className="text-base capitalize sm:text-lg">
              {dashboardTitle}
            </Label>
          </section>
        </section>
      </section>
      <section className="sticky right-4 flex items-center justify-end gap-1 sm:gap-2">
        <span>
          <ThemeToggle />
        </span>
        <Notifications />
        <UserProfileDropdown userData={userData as User} />
      </section>
    </header>
  );
}
