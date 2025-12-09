"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  BukkaButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { Business } from "@/data/interfaces/Business";
import { useAuth } from "@/providers";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { ClaimPageForm } from "../forms/claim-business-form";

export function ClaimBusinessModal({
  data,
  open,
  onOpenChange,
  onBack,
}: {
  data: Business | Recommendation;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onBack: () => void;
}) {
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Ownership</DialogTitle>
          <DialogDescription>
            Completing this form helps us confirm that you are the rightful
            owner of this business.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="h-[50vh]">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Required Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                To continue, please provide the details below. This information
                helps us validate your claim and keep our platform accurate.
              </p>

              <Separator />

              <ClaimPageForm />
            </CardContent>
          </Card>
        </ScrollArea>

        <p className="text-xs text-muted-foreground text-center mt-6">
          This process usually takes 24–48 hours. We’ll notify you once your
          claim is approved.
        </p>

        <DialogFooter className="flex justify-between mt-6">
          {/* <DialogClose asChild>
            <BukkaButton variant="secondary">Cancel</BukkaButton>
          </DialogClose> */}

          <BukkaButton variant="secondary" onClick={onBack}>
            Back
          </BukkaButton>

          <BukkaButton
            variant="glow"

            // onClick={onSubmit}
          >
            Submit Request
          </BukkaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
