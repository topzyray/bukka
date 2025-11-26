import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CookieCategory } from "@/types";
import { Button, Checkbox } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    title: "Essential",
    description: "Required for site functionality",
    required: true,
    defaultEnabled: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Help us improve the product",
    defaultEnabled: false,
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Personalized content & ads",
    defaultEnabled: false,
  },
];

type Props = {
  persistToServer?: (state: any) => Promise<void> | void; // optional side-effect hook
  minimal?: boolean; // show banner-only instead of full dialog initially
};

export const CookiesConsent: React.FC<Props> = ({
  persistToServer,
  minimal = true,
}) => {
  const { consent, acceptAll, acceptSelected, resetConsent, setConsent } =
    useCookieConsent(DEFAULT_CATEGORIES);
  const [open, setOpen] = useState(false);
  const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (consent) setLocalPrefs({ ...consent.preferences });
  }, [consent]);

  const showBanner = useMemo(
    () => !consent || Object.keys(consent.preferences).length === 0,
    [consent]
  );

  function handleSave() {
    acceptSelected(localPrefs);
    setOpen(false);
    if (persistToServer)
      persistToServer({ ...localPrefs, timestamp: Date.now() });
  }

  // quick accept all button
  function handleAcceptAll() {
    acceptAll();
    setOpen(false);
    if (persistToServer)
      persistToServer({ acceptedAll: true, timestamp: Date.now() });
  }

  if (!showBanner && minimal === true) return null;

  return (
    <>
      {/* Banner (bottom) */}
      {showBanner && (
        <div className="fixed left-4 right-4 md:left-auto md:right-8 bottom-6 z-[1200]">
          <div className="glass p-4 flex items-center gap-4 rounded-lg shadow-glow animate-[var(--animate-fade-in)]">
            <div className="flex-1 text-left">
              <p className="font-semibold">
                We use cookies to improve your experience
              </p>
              <p className="text-sm text-muted-foreground">
                You can choose which cookies to allow.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Button onClick={() => setOpen(true)} variant="outline">
                Manage
              </Button>
              <Button onClick={handleAcceptAll}>Accept all</Button>
            </div>
          </div>
        </div>
      )}

      {/* Full settings dialog */}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Select which cookies you allow. You can change these anytime.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {DEFAULT_CATEGORIES.map((cat) => {
              const checked =
                localPrefs[cat.id] ??
                cat.defaultEnabled ??
                cat.required ??
                false;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium">
                      {cat.title}
                      {cat.required ? " • Required" : ""}
                    </span>
                    {cat.description && (
                      <span className="text-sm text-muted-foreground">
                        {cat.description}
                      </span>
                    )}
                  </div>

                  <div>
                    <Checkbox
                      checked={checked}
                      disabled={!!cat.required}
                      onCheckedChange={(v) => {
                        setLocalPrefs((s) => ({ ...s, [cat.id]: !!v }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="flex items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => {
                  resetConsent();
                  setLocalPrefs({});
                }}
              >
                Reset
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save preferences</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookiesConsent;
