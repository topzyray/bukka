"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { LocationConsent } from "./location-consent";
import { MapPin } from "lucide-react";

export function EnableLocationButton({
  trigger,
  showText = false,
}: {
  trigger?: React.ReactNode;
  showText?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size={showText ? "sm" : "icon"}
        variant="ghost"
        onClick={() => setOpen(true)}
        title="Turn on location to see restaurants and Bukkas near you."
        className="dark:text-foreground"
      >
        {trigger ?? <MapPin size={16} />}
        {showText ?? " Enable location"}
      </Button>

      {open && (
        <LocationConsent
          promptText="Turn on location to see restaurants and other Bukkas near you."
          mobileSheet={true}
          enableLocation={open}
        />
      )}
    </>
  );
}
