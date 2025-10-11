"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SessionExpirationModal() {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const hasHandled = useRef(false); // ✅ prevents duplicate triggers
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      if (hasHandled.current) return; // ✅ ignore repeats

      hasHandled.current = true;
      setOpen(true);
      toast.error("Your session has expired.");
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  const handleReLogin = useCallback(() => {
    setOpen(false);
    router.replace("/signin");
  }, [router]);

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) {
      handleReLogin();
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, handleReLogin, open]);

  const handleStay = () => {
    toast("You can still view this page, but data may be outdated.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Session Expired
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          Your session has expired for security reasons. Please sign in again to
          continue.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected automatically in <strong>{countdown}</strong>{" "}
          seconds.
        </p>
        <DialogFooter className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={handleStay}>
            Stay on page
          </Button>
          <Button onClick={handleReLogin}>Re-login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
