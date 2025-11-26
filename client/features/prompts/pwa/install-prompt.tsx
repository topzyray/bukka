import React, { useState } from "react";
import { usePWAInstall } from "@/hooks/use-pwa-installs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const InstallPrompt: React.FC = () => {
  const { canInstall, promptInstall } = usePWAInstall();
  const [open, setOpen] = useState(false);
  // Automatically show a friendly UI when canInstall becomes true.
  React.useEffect(() => {
    if (canInstall) setOpen(true);
  }, [canInstall]);

  async function handleInstall() {
    setOpen(false);
    const result = await promptInstall();
    // optionally track the result to analytics, e.g. result.outcome === 'accepted'
    console.debug("PWA install result", result);
  }

  // nothing shown until browser fires beforeinstallprompt
  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Install this app?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Install for faster access and offline features.
          </p>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            We recommend installing the app — it's fast, works offline and looks
            great on your device.
          </p>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
          <Button onClick={handleInstall}>Install</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPrompt;
