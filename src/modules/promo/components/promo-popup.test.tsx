import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PromoPopup } from "#/modules/promo/components/promo-popup.tsx";

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("PromoPopup", () => {
  it("renders the promo image with a non-empty descriptive alt and the correct src", () => {
    render(<PromoPopup />);
    act(() => {
      vi.runAllTimers();
    });

    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image.src).toContain("promo-0002.webp");
    expect(image.alt.length).toBeGreaterThan(0);
    expect(image.alt.toLowerCase()).toContain("promo");
  });

  it("exposes the dialog accessible name 'Promo Mundialista Nómada'", () => {
    render(<PromoPopup />);
    act(() => {
      vi.runAllTimers();
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-label")).toBe("Promo Mundialista Nómada");
  });

  it("has a close button with a descriptive aria-label", () => {
    render(<PromoPopup />);
    act(() => {
      vi.runAllTimers();
    });

    const closeButtons = screen.getAllByRole("button");
    const labeled = closeButtons.some((button) => {
      const label = button.getAttribute("aria-label");
      return Boolean(label && label.length > 0);
    });
    expect(labeled).toBe(true);
  });

  it("calls dismiss (writes cadence timestamp) when onOpenChange(false) fires", () => {
    render(<PromoPopup />);
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByRole("dialog")).not.toBeNull();

    const closeButton = screen.getAllByRole("button")[0];
    act(() => {
      closeButton.click();
    });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      window.localStorage.getItem("nomada:promo-popup-last-shown"),
    ).not.toBeNull();
  });
});
