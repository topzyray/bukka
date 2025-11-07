"use client";

import { Card, CardContent } from "@/components/ui";
import { SettingsNav } from "@/features/dashboard/shared/components/settings-nav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User & System Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage, customize and view all settings
          </p>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-4 animate-[fade-in_0.3s_ease-out] h-[100vh]">
        <aside className="w-full lg:max-w-[16rem]">
          <Card className="rounded-lg lg:h-full border-2">
            <CardContent>
              <SettingsNav />
            </CardContent>
          </Card>
        </aside>

        <section className="flex-1 lg:h-full">
          <Card className="animate-[slide-up_0.4s_ease-out] rounded-lg lg:h-full dark:bg-accent-foreground border-2">
            <CardContent>{children}</CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}
