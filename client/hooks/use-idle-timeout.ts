// useIdleTimeout.ts
import { useEffect } from "react";

const IDLE_LIMIT = 15 * 60 * 1000; // 15 mins

export function useIdleTimeout() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        window.dispatchEvent(new Event("sessionExpired"));
      }, IDLE_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);
}
