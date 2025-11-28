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

export function RecommendAPlace() {
  return (
    <PageWrapper>
      <PageWrapperHeader className="sticky top-0 backdrop-blur z-50">
        <Header />
      </PageWrapperHeader>
      <PageWrapperContent className="bg-gradient-subtle">
        <PageWrapperContentWithFramer>
          <div className="flex h-[50vh]">
            <div className="h-full flex justify-center items-center gap-6">
              <p className="text-3xl text-center">Coming up soon</p>
            </div>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
      <PageWrapperFooter>
        <Footer />
      </PageWrapperFooter>
    </PageWrapper>
  );
}
