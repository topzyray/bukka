"use client";

import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
  PageWrapperHeader,
} from "@/components/ui";
import { RecommendBusinessForm } from "./forms/recommend-business-form";
import { toast } from "sonner";
import { useAuth } from "@/providers";
import { redirect } from "next/navigation";

export function RecommendAPlace() {
  const { user } = useAuth();

  if (!user) {
    redirect("/signin");
  }

  return (
    <PageWrapper>
      <PageWrapperHeader className="sticky top-0 backdrop-blur z-50 shadow-sm">
        <Header />
      </PageWrapperHeader>

      <PageWrapperContent className="bg-gradient-subtle">
        <PageWrapperContentWithFramer>
          <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Recommend a Place
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Help us discover new businesses! Your recommendation will be
              reviewed by our team.
            </p>

            <RecommendBusinessForm
              onSuccess={() => toast.success("Thanks for your recommendation!")}
            />
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>

      <PageWrapperFooter>
        <Footer />
      </PageWrapperFooter>
    </PageWrapper>
  );
}
