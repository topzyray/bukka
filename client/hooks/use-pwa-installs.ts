import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      // intercept the event and prevent the default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    // If app is already installed (desktop / mobile), canInstall should be false
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setCanInstall(false);
    });
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return { outcome: "no-prompt" };
    try {
      // show default browser prompt
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice; // returns outcome: accepted/ dismissed
      setDeferredPrompt(null);
      setCanInstall(false);
      return choice;
    } catch (err) {
      console.warn("install prompt failed", err);
      return { outcome: "error", error: err };
    }
  }

  return { canInstall, promptInstall, deferredPrompt };
}
