import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "#/shared/ui/components/dialog.tsx";

afterEach(() => {
  cleanup();
});

describe("Dialog", () => {
  it("composes Root + Content + Close into an accessible dialog", () => {
    render(
      <Dialog open={true}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toBeNull();
    expect(screen.getByRole("button", { name: "Close" })).not.toBeNull();
  });

  it("calls onOpenChange(false) when ESC is pressed", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("calls onOpenChange(false) when the overlay is clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const overlay = document.querySelector(
      '[data-slot="dialog-overlay"]',
    ) as HTMLElement;
    expect(overlay).not.toBeNull();

    // Radix's DismissableLayer registers its pointerdown listener on the
    // next tick (setTimeout(..., 0)), so we must wait a tick before firing.
    await new Promise((resolve) => setTimeout(resolve, 0));
    fireEvent.pointerDown(overlay);
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("calls onOpenChange(false) when the Close part is activated", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("toggles data-state between open and closed", () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const content = document.querySelector(
      '[data-slot="dialog-content"]',
    ) as HTMLElement;
    expect(content.getAttribute("data-state")).toBe("open");

    rerender(
      <Dialog open={false}>
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the overlay with data-slot dialog-overlay", () => {
    render(
      <Dialog open={true}>
        <DialogOverlay />
        <DialogContent aria-label="Test dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(
      document.querySelectorAll('[data-slot="dialog-overlay"]').length,
    ).toBeGreaterThan(0);
  });
});
