"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BukkaButton } from "@/components/ui";
import { useState } from "react";

export function ClaimDetailsDrawer({
  claim,
  onClose,
}: {
  claim: any;
  onClose: () => void;
}) {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = () => {
    setLoadingApprove(true);
    setTimeout(() => {
      setLoadingApprove(false);
      onClose();
    }, 1000);
  };

  const handleReject = () => {
    setLoadingReject(true);
    setTimeout(() => {
      setLoadingReject(false);
      onClose();
    }, 1000);
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Review Claim</SheetTitle>
          <SheetDescription>
            Review the details below before approving or rejecting this claim.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-medium text-sm">Business Name</h3>
            <p className="text-muted-foreground">{claim.businessName}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm">Claimed By</h3>
            <p className="text-muted-foreground">{claim.userName}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm">Phone Number</h3>
            <p className="text-muted-foreground">{claim.phone}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm">Date Submitted</h3>
            <p className="text-muted-foreground">{claim.submittedAt}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-sm">Ownership Document</h3>
            <p className="text-muted-foreground">
              (Optional) If the user uploaded a file, show a preview or a
              download link here.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm">Additional Notes</h3>
            <p className="text-muted-foreground">
              If the user included any notes, show them here.
            </p>
          </div>
        </div>

        <SheetFooter className="flex flex-col gap-3 mt-8">
          <BukkaButton
            variant="glow"
            className="w-full"
            // loading={loadingApprove}
            onClick={handleApprove}
          >
            Approve Claim
          </BukkaButton>

          <BukkaButton
            variant="destructive"
            className="w-full"
            // loading={loadingReject}
            onClick={handleReject}
          >
            Reject Claim
          </BukkaButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
