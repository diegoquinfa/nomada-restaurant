import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PROMO_POPUP_REAPPEAR_MS,
  usePromoPopupVisibility,
} from "#/modules/promo/hooks/use-promo-popup-visibility.ts";

const STORAGE_KEY = "nomada:promo-popup-last-shown";

describe("usePromoPopupVisibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts closed on initial render (SSR-safe)", () => {
    const { result } = renderHook(() => usePromoPopupVisibility());
    expect(result.current.open).toBe(false);
  });

  it("opens after mount when no prior visit is recorded", () => {
    const { result } = renderHook(() => usePromoPopupVisibility());

    expect(result.current.open).toBe(false);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(true);
  });

  it("opens when the stored timestamp is older than the cadence window", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() - PROMO_POPUP_REAPPEAR_MS - 1000),
    );

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(true);
  });

  it("stays closed when the stored timestamp is within the cadence window", () => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(false);
  });

  it("dismiss() closes the popup and writes the cadence timestamp", () => {
    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.open).toBe(true);

    const before = Date.now();
    act(() => {
      result.current.dismiss();
    });

    expect(result.current.open).toBe(false);
    const stored = Number(window.localStorage.getItem(STORAGE_KEY));
    expect(stored).toBeGreaterThanOrEqual(before);
  });
});
