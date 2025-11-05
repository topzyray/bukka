"use client";

import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
} from "@/components/ui";
import { Card } from "@/components/ui/card";
import { SettingsNav } from "@/features/dashboard/shared/components/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageWrapper>
      <PageWrapperContent className="h-full">
        <PageWrapperContentWithFramer className="h-full">
          <div className="flex flex-col md:flex-row gap-4 min-h-[80vh] h-full animate-[fade-in_0.3s_ease-out]">
            <aside className="w-full h-full md:max-w-[16rem]">
              <Card className="p-4 rounded-lg h-full">
                <SettingsNav />
              </Card>
            </aside>

            <section className="flex-1">
              <Card className="p-6 animate-[slide-up_0.4s_ease-out] rounded-lg h-full">
                {children}
              </Card>
            </section>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
    </PageWrapper>
  );
}
