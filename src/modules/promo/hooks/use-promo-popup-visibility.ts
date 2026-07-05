import { useCallback, useEffect, useMemo, useState } from "react";

import { type Promo, promos } from "#/modules/promo/promos.config.ts";

const DISMISS_KEY_PREFIX = "nomada:promo-dismissed:";
export const PROMO_POPUP_REAPPEAR_MS = 0 * 60 * 1000; // 1 hour

export function getColombiaDay(date: Date): number {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    weekday: "short",
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;

  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const day = map[weekday ?? ""];
  if (day === undefined) {
    throw new Error(`Unexpected Colombia weekday: ${weekday}`);
  }

  return day;
}

export function isPromoActive(promo: Promo, now: number): boolean {
  if (promo.startDate !== undefined) {
    const start = Date.parse(promo.startDate);
    if (Number.isNaN(start) || now < start) return false;
  }

  if (promo.endDate !== undefined) {
    const end = Date.parse(promo.endDate);
    if (Number.isNaN(end) || now > end) return false;
  }

  const colombiaDay = getColombiaDay(new Date(now));
  return promo.activeDays.includes(colombiaDay);
}

function isPromoRecentlyDismissed(promo: Promo, now: number): boolean {
  const raw = window.localStorage.getItem(`${DISMISS_KEY_PREFIX}${promo.id}`);
  if (!raw) return false;

  const dismissed = Number(raw);
  if (Number.isNaN(dismissed)) return false;

  return now - dismissed <= PROMO_POPUP_REAPPEAR_MS;
}

export function usePromoPopupVisibility() {
  const [open, setOpen] = useState(false);

  const activePromos = useMemo<Promo[]>(() => {
    if (typeof window === "undefined") return [];

    const now = Date.now();
    return promos.filter(
      (promo) =>
        isPromoActive(promo, now) && !isPromoRecentlyDismissed(promo, now),
    );
  }, []);

  useEffect(() => {
    if (activePromos.length === 0) return;

    const id = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(id);
  }, [activePromos]);

  const dismiss = useCallback(() => {
    setOpen(false);
    if (activePromos.length === 0) return;

    const timestamp = String(Date.now());
    for (const promo of activePromos) {
      try {
        window.localStorage.setItem(
          `${DISMISS_KEY_PREFIX}${promo.id}`,
          timestamp,
        );
      } catch {
        // localStorage may be unavailable (private mode / quota) — ignore.
      }
    }
  }, [activePromos]);

  return { open, activePromos, dismiss };
}
