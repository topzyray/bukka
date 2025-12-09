"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClaimPageForm } from "./forms/claim-business-form";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
  PageWrapperHeader,
} from "@/components/ui";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";

export default function ClaimBusiness() {
  return (
    <PageWrapper>
      <PageWrapperHeader>
        <Header />
      </PageWrapperHeader>
      <PageWrapperContent>
        <PageWrapperContentWithFramer>
          <div className="py-10">
            <h1 className="text-3xl font-bold mb-2">Verify Your Ownership</h1>
            <p className="text-muted-foreground mb-8">
              Completing this form helps us confirm that you are the rightful
              owner of this business.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Required Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  To continue, please provide the details below. This
                  information helps us validate your claim and keep our platform
                  accurate.
                </p>

                <Separator />

                <ClaimPageForm />
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center mt-6">
              This process usually takes 24–48 hours. We’ll notify you once your
              claim is approved.
            </p>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
      <PageWrapperFooter>
        <Footer />
      </PageWrapperFooter>
    </PageWrapper>
  );
}
