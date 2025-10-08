import { useEffect } from "react";
import { ConfirmationSession } from "@/lib/confirmation-session-utils";
import { useRouter } from "next/navigation";

export function useConfirmEmailWatcher() {
  const router = useRouter();

  useEffect(() => {
    const session = ConfirmationSession.getConfirmationSession();
    if (!session) return;

    const expires = new Date(session.confirmationCodeExpires).getTime();
    const now = Date.now();
    const timeLeft = expires - now;

    if (timeLeft <= 0) {
      ConfirmationSession.clearConfirmationSession();
      router.replace("/signin");
      return;
    }

    const timer = setTimeout(() => {
      ConfirmationSession.clearConfirmationSession();
      router.replace("/signin");
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [router]);
}
