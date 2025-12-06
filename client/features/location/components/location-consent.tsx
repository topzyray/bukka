"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Skeleton,
  DialogClose,
  SheetClose,
  Separator,
} from "@/components/ui";
import { STORE_KEYS } from "@/configs";
import { useIsMobile, useLocationPermission } from "@/hooks";
import { useUserLocation } from "@/providers";
import { StorageUtilsHelper } from "@/utils";
import React, { useEffect, useState } from "react";

type Props = {
  promptText?: string;
  mobileSheet?: boolean;
  enableLocation?: boolean;
  setEnableLocation?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LocationConsent: React.FC<Props> = ({
  promptText,
  mobileSheet = true,
  enableLocation,
  setEnableLocation,
}) => {
  const { loading, position, error, request, hasCooldownExpired } =
    useLocationPermission();
  const { setUserCoordinates } = useUserLocation();

  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const granted = StorageUtilsHelper.getItemFromLocalStorage(
      STORE_KEYS.LOCATION_GRANTED
    );
    const deniedAt = StorageUtilsHelper.getItemFromLocalStorage(
      STORE_KEYS.LOCATION_DENIED_AT
    );

    if (granted === "true") return;
    if (deniedAt && !hasCooldownExpired()) return;
    setOpen(true);
  }, []);

  async function handleAllow() {
    const geo = await request({
      enableHighAccuracy: false,
      maximumAge: 60_000,
    });
    if (geo) {
      setUserCoordinates({ lat: geo.latitude, lng: geo.longitude });
      setOpen(false);
    }
  }

  function handleReject() {
    setOpen(false);
  }

  if (mobileSheet && isMobile) {
    return (
      <Sheet
        open={open || enableLocation}
        onOpenChange={setOpen || setEnableLocation}
      >
        <SheetContent
          side="bottom"
          className="glass rounded-t-xl max-w-full md:max-w-md animate-(--animate-slide-up)"
        >
          <SheetHeader>
            <SheetTitle>Allow location access?</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {promptText ??
                "We use your location to show nearby places and better results."}
            </p>
          </SheetHeader>

          <div className="py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <SheetFooter className="flex justify-end gap-2">
            <SheetClose asChild>
              <Button
                variant="ghost"
                onClick={handleReject}
                className="dark:text-foreground"
              >
                No thanks
              </Button>
            </SheetClose>
            <Button
              onClick={handleAllow}
              disabled={loading}
              className="dark:text-foreground dark:border dark:border-foreground"
            >
              {loading ? "Locating…" : "Allow location"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog
      open={open || enableLocation}
      onOpenChange={setOpen || setEnableLocation}
    >
      <DialogContent className="max-w-md glass rounded-lg animate-(--animate-fade-in)">
        <DialogHeader>
          <DialogTitle>Allow location access?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {promptText ??
              "We use your location to show nearby places and better results."}
          </p>
        </DialogHeader>

        <div className="py-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {position && (
            <p className="text-sm">
              Using location: {position?.latitude.toFixed(7)},{" "}
              {position?.longitude.toFixed(7)}
            </p>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              onClick={handleReject}
              className="dark:text-foreground"
            >
              No thanks
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={handleAllow}
            className="dark:text-foreground dark:border dark:border-foreground"
          >
            {loading ? "Locating…" : "Allow location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
