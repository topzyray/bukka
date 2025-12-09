"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui";

import { BukkaButton } from "@/components/ui";
import { Loader2 } from "lucide-react";

import {
  useApproveClaim,
  useRejectClaim,
} from "@/data/mutations/claim/use-claim-mutation";

import { ClaimStatusEnum } from "@/data/enums";

export function ClaimDetailsDrawer({
  open,
  onClose,
  claim,
}: {
  open: boolean;
  onClose: () => void;
  claim: any;
}) {
  const approveMutation = useApproveClaim({});
  const rejectMutation = useRejectClaim({});

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Claim Details</DrawerTitle>
          <DrawerDescription>
            Review business claim info before approval.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-4">
          <div>
            <p className="font-semibold">Business</p>
            <p>{claim.business?.name}</p>
          </div>

          <div>
            <p className="font-semibold">Claimer</p>
            <p>
              {claim.claimer?.firstName} {claim.claimer?.lastName}
            </p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p>{claim.claimer?.email}</p>
          </div>

          <div>
            <p className="font-semibold">Phone</p>
            <p>{claim.claimer?.phoneNumber}</p>
          </div>

          <div>
            <p className="font-semibold">Additional Notes</p>
            <p>{claim.notes ?? "No notes"}</p>
          </div>

          <div className="flex gap-3 pt-6">
            <BukkaButton
              className="flex-1"
              variant="success"
              disabled={
                approveMutation.isPending ||
                claim.status !== ClaimStatusEnum.PENDING
              }
              onClick={() => approveMutation.mutate(claim.id)}
            >
              {approveMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Approve"
              )}
            </BukkaButton>

            <BukkaButton
              className="flex-1"
              variant="warning"
              disabled={
                rejectMutation.isPending ||
                claim.status !== ClaimStatusEnum.PENDING
              }
              onClick={() => rejectMutation.mutate(claim.id)}
            >
              {rejectMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Reject"
              )}
            </BukkaButton>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
