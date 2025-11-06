"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Settings,
  User,
  Lock,
  Activity,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { useAuth } from "@/providers";

const navItems = [
  {
    name: "Overview",
    href: "settings",
    icon: LayoutDashboard,
    description: "Summary of all setting page",
  },
  {
    name: "Profile",
    href: "settings/profile",
    icon: User,
    description: "User profile information",
  },
  {
    name: "Personalization",
    href: "settings/personalization",
    icon: Settings,
    description: "Manage dietary and delivery preferences",
  },
  {
    name: "Account",
    href: "settings/account",
    icon: User,
    description: "Profile, password, and email preferences",
  },
  {
    name: "Notification",
    href: "settings/notification",
    icon: Mail,
    description: "Manage Notification preference preferences",
  },
  {
    name: "Privacy",
    href: "settings/privacy",
    icon: Lock,
    description: "Control visibility and data sharing",
  },
  {
    name: "Sessions",
    href: "settings/sessions",
    icon: Activity,
    description: "View active sessions and activity logs",
  },
];

export function SettingsNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    // <nav className="bg-card border border-border rounded-lg p-3 space-y-1 shadow-card">
    <nav className="flex flex-wrap gap-1 md:flex-col space-y-1">
      {navItems.map((tab) => {
        const isActive = pathname.endsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={`/dashboard/${user?.role.toLowerCase()}/${tab.href}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              "text-text hover:bg-sidebar-accent hover:text-sidebar-accent-foreground pl-2 text-sm"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
