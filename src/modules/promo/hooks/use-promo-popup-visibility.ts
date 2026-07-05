import { useCallback, useEffect, useState } from "react";

const PROMO_POPUP_STORAGE_KEY = "nomada:promo-popup-last-shown";
export const PROMO_POPUP_REAPPEAR_MS = 0 * 60 * 1000; // 1h

export function usePromoPopupVisibility() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(PROMO_POPUP_STORAGE_KEY);
    const last = raw ? Number(raw) : 0;
    const shouldShow =
      Number.isNaN(last) || Date.now() - last > PROMO_POPUP_REAPPEAR_MS;
    if (!shouldShow) return;

    const id = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(PROMO_POPUP_STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage may be unavailable (private mode / quota) — ignore.
    }
  }, []);

  return { open, dismiss };
}
