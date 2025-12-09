"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BukkaButton } from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { Business } from "@/data/interfaces/Business";
import { toast } from "sonner";
import { useAuth } from "@/providers";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { ClaimBusinessModal } from "./claim-business-modal-form";

export function ClaimBusinessInfoModal({
  data,
  open,
  onOpenChange,
  onContinue,
}: {
  data: Business | Recommendation;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onContinue: () => void;
}) {
  const { user } = useAuth();

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogTrigger asChild> */}
        <BukkaButton
          size="sm"
          variant="glow"
          onClick={() => {
            toast("Coming Soon!", {
              description:
                "Please check back later or contact the admin to claim business urgently!",
            });
            // onOpenChange(true);
            // if (!user) {
            //   toast("Requires Signin", {
            //     description: "You need to sign in to claim this business",
            //   });
            // } else {
            //   onOpenChange(true);
            // }
          }}
        >
          Claim Business
        </BukkaButton>
        {/* </DialogTrigger> */}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Claim this Business</DialogTitle>
            <DialogDescription>
              To claim ownership of this business, you’ll need to provide proof
              of ownership on the next step. This helps keep information
              accurate and prevents unauthorized changes.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="space-y-4 text-sm">
            <p>
              By continuing, you’ll start the claim process. You may be asked
              to:
            </p>

            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide a valid phone number</li>
              <li>Upload proof of business ownership</li>
              <li>Verify your identity</li>
            </ul>
          </div>

          <DialogFooter className="flex justify-between mt-6">
            <BukkaButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </BukkaButton>

            <BukkaButton variant="glow" onClick={onContinue}>
              Continue
            </BukkaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
