import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getColombiaDay,
  isPromoActive,
  PROMO_POPUP_REAPPEAR_MS,
  usePromoPopupVisibility,
} from "#/modules/promo/hooks/use-promo-popup-visibility.ts";

const DISMISS_KEY_PREFIX = "nomada:promo-dismissed:";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

vi.mock("#/modules/promo/promos.config.ts", () => ({
  promos: [
    {
      id: "test-promo-a",
      images: [{ src: "/a.webp", alt: "A" }],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [0], // Monday
    },
    {
      id: "test-promo-b",
      images: [{ src: "/b.webp", alt: "B" }],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [0], // Monday
    },
    {
      id: "test-promo-tuesday",
      images: [{ src: "/c.webp", alt: "C" }],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [1], // Tuesday
    },
  ],
}));

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

  it("opens after mount and aggregates every active promo for the day", () => {
    vi.setSystemTime(new Date("2026-07-06T12:00-05:00")); // Monday

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(true);
    expect(result.current.activePromos.map((promo) => promo.id)).toEqual([
      "test-promo-a",
      "test-promo-b",
    ]);
  });

  it("aggregates a single promo when only one is active", () => {
    vi.setSystemTime(new Date("2026-07-07T12:00-05:00")); // Tuesday

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(true);
    expect(result.current.activePromos.map((promo) => promo.id)).toEqual([
      "test-promo-tuesday",
    ]);
  });

  it("stays closed when no promo is active for the current day", () => {
    vi.setSystemTime(new Date("2026-07-12T12:00-05:00")); // Sunday

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(false);
    expect(result.current.activePromos).toEqual([]);
  });

  it("stays closed when no promo is active for the current date", () => {
    vi.setSystemTime(new Date("2026-08-01T12:00-05:00"));

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(false);
    expect(result.current.activePromos).toEqual([]);
  });

  it("stays closed when every active promo was dismissed within the reappear window", () => {
    vi.setSystemTime(new Date("2026-07-06T12:00-05:00")); // Monday
    const recent = String(Date.now() - PROMO_POPUP_REAPPEAR_MS + 1000);
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}test-promo-a`, recent);
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}test-promo-b`, recent);

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(false);
  });

  it("opens when the dismissed promos are outside the reappear window", () => {
    vi.setSystemTime(new Date("2026-07-06T12:00-05:00")); // Monday
    const stale = String(Date.now() - PROMO_POPUP_REAPPEAR_MS - 1000);
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}test-promo-a`, stale);
    window.localStorage.setItem(`${DISMISS_KEY_PREFIX}test-promo-b`, stale);

    const { result } = renderHook(() => usePromoPopupVisibility());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.open).toBe(true);
  });

  it("dismiss() closes the popup and writes the cadence timestamp for every active promo", () => {
    vi.setSystemTime(new Date("2026-07-06T12:00-05:00")); // Monday

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
    const storedA = Number(
      window.localStorage.getItem(`${DISMISS_KEY_PREFIX}test-promo-a`),
    );
    const storedB = Number(
      window.localStorage.getItem(`${DISMISS_KEY_PREFIX}test-promo-b`),
    );
    expect(storedA).toBeGreaterThanOrEqual(before);
    expect(storedB).toBeGreaterThanOrEqual(before);
  });

  describe("isPromoActive", () => {
    const promo = {
      id: "x",
      images: [],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [0],
    };

    it("returns true inside the date range and on an active day", () => {
      expect(isPromoActive(promo, Date.parse("2026-07-06T12:00-05:00"))).toBe(
        true,
      );
    });

    it("returns false before the start date", () => {
      expect(isPromoActive(promo, Date.parse("2026-06-30T12:00-05:00"))).toBe(
        false,
      );
    });

    it("returns false after the end date", () => {
      expect(isPromoActive(promo, Date.parse("2026-07-13T12:00-05:00"))).toBe(
        false,
      );
    });

    it("returns false on a non-active day", () => {
      expect(isPromoActive(promo, Date.parse("2026-07-07T12:00-05:00"))).toBe(
        false,
      );
    });

    it("returns true when dates are omitted and the day matches", () => {
      const openPromo = {
        id: "open",
        images: [],
        activeDays: [0],
      };
      expect(
        isPromoActive(openPromo, Date.parse("2026-07-06T12:00-05:00")),
      ).toBe(true);
    });
  });

  describe("getColombiaDay", () => {
    it("maps Colombia weekdays to 0=Monday ... 6=Sunday", () => {
      expect(getColombiaDay(new Date("2026-07-06T12:00-05:00"))).toBe(0);
      expect(getColombiaDay(new Date("2026-07-12T12:00-05:00"))).toBe(6);
    });
  });
});
