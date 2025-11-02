export class BusinessHelper {
  /** Parse "HH:MM" string to minutes since midnight */

  private static hhmmToMinutes = (hhmm?: string) => {
    if (!hhmm) return null;
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr ?? 0);
    const m = Number(mStr ?? 0);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  /**
   * Determine whether the business is open now.
   * Works with periods where period.day might be:
   *  - 0..6 (0=Sunday) OR
   *  - 1..7 (1=Monday)
   *
   * Also supports overnight ranges (closeTime < openTime).
   *
   * Expected openingHours shape:
   * { periods: [{ day: number, openTime: "HH:MM", closeTime: "HH:MM"}], weekdayText: [...] }
   */
  static isOpenNow = (openingHours: any): boolean => {
    try {
      if (!openingHours?.periods || !Array.isArray(openingHours.periods))
        return false;

      const now = new Date();
      const todayDay0 = now.getDay(); // 0 = Sunday ... 6 = Saturday
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // find candidate periods matching today under multiple possible conventions
      const matches = openingHours.periods.filter((p: any) => {
        if (p?.day === undefined || p?.openTime == null || p?.closeTime == null)
          return false;
        const d = Number(p.day);
        if (Number.isNaN(d)) return false;
        // Accept if day matches either 0-based or 1-based mapping
        return (
          d === todayDay0 ||
          d === todayDay0 + 1 ||
          d === (todayDay0 === 0 ? 7 : todayDay0)
        );
      });

      if (!matches.length) return false;

      // If any match satisfies current time, return true.
      for (const p of matches) {
        const open = this.hhmmToMinutes(p.openTime);
        const close = this.hhmmToMinutes(p.closeTime);
        if (open === null || close === null) continue;

        // Normal same-day range
        if (close >= open) {
          if (currentMinutes >= open && currentMinutes <= close) return true;
        } else {
          // Overnight range, e.g., open 20:00 (1200) close 04:00 (240)
          // Open from open..midnight and from 0..close
          if (currentMinutes >= open || currentMinutes <= close) return true;
        }
      }
      return false;
    } catch {
      // In case of unexpected shape, default to closed.
      // Optionally log error in production
      // console.error("isOpenNow error", err);
      return false;
    }
  };
}
