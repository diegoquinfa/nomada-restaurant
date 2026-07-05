import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PromoPopup } from "#/modules/promo/components/promo-popup.tsx";

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
      id: "promo-solo",
      images: [{ src: "/images/promo/solo.webp", alt: "Promo Solo" }],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [2], // Wednesday
    },
  ],
}));

describe("PromoPopup — single active promo", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-01T12:00-05:00")); // Wednesday
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders a bare image with no navigation controls or progress bars for a single slide", () => {
    render(<PromoPopup />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /anterior/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /siguiente/i })).toBeNull();
  });
});
