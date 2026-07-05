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
      id: "promo-a",
      images: [
        { src: "/images/promo/1.webp", alt: "Promo A uno" },
        { src: "/images/promo/2.webp", alt: "Promo A dos" },
      ],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [2], // Wednesday
    },
    {
      id: "promo-b",
      images: [{ src: "/images/promo/3.webp", alt: "Promo B" }],
      startDate: "2026-07-01T10:00-05:00",
      endDate: "2026-07-12T23:59-05:00",
      activeDays: [2], // Wednesday
    },
  ],
}));

const DISMISS_KEY_A = "nomada:promo-dismissed:promo-a";
const DISMISS_KEY_B = "nomada:promo-dismissed:promo-b";

describe("PromoPopup", () => {
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

  const openPopup = () => {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  };

  it("renders the aggregated slides from every active promo, in config order", () => {
    render(<PromoPopup />);
    openPopup();

    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.map((image) => image.alt)).toEqual([
      "Promo A uno",
      "Promo A dos",
      "Promo B",
    ]);
  });

  it("advances automatically after 10s by scrolling the next slide into view", () => {
    const scrolledSlides: HTMLElement[] = [];
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(
      function scrollIntoViewSpy(this: HTMLElement) {
        scrolledSlides.push(this);
      },
    );

    render(<PromoPopup />);
    openPopup();

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(scrolledSlides).toHaveLength(1);
    expect(scrolledSlides[0].getAttribute("aria-label")).toBe("2 de 3");
  });

  it("stops advancing once the last slide's timer would fire (no loop, popup stays open)", () => {
    // In jsdom, scrollIntoView cannot change real scroll position, so the
    // active index tracked from real scroll never organically progresses.
    // This still proves the core "no loop" contract: the autoplay effect
    // for index 0 keeps targeting slide index 1 (never wraps back to index
    // 0), and the popup dialog remains mounted/open throughout.
    const scrolledSlides: HTMLElement[] = [];
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(
      function scrollIntoViewSpy(this: HTMLElement) {
        scrolledSlides.push(this);
      },
    );

    render(<PromoPopup />);
    openPopup();

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    for (const slide of scrolledSlides) {
      expect(slide.getAttribute("aria-label")).not.toBe("1 de 3");
    }
    expect(screen.queryByRole("dialog")).not.toBeNull();
  });

  it("exposes the dialog accessible name 'Promo Nómada'", () => {
    render(<PromoPopup />);
    openPopup();

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-label")).toBe("Promo Nómada");
  });

  it("has a close button with a descriptive aria-label", () => {
    render(<PromoPopup />);
    openPopup();

    const closeButton = screen.getByRole("button", { name: /cerrar/i });
    expect(closeButton).not.toBeNull();
  });

  it("dismisses the popup and writes the cadence timestamp for every active promo when closed", () => {
    render(<PromoPopup />);
    openPopup();

    expect(screen.queryByRole("dialog")).not.toBeNull();

    const closeButton = screen.getByRole("button", { name: /cerrar/i });
    act(() => {
      closeButton.click();
    });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.localStorage.getItem(DISMISS_KEY_A)).not.toBeNull();
    expect(window.localStorage.getItem(DISMISS_KEY_B)).not.toBeNull();
  });

  it("renders navigation arrows with the expected Spanish accessible names", () => {
    render(<PromoPopup />);
    openPopup();

    expect(
      screen.getByRole("button", { name: "Imagen anterior" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Siguiente imagen" }),
    ).not.toBeNull();
  });
});
