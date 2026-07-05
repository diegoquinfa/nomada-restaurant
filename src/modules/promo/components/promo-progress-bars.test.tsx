import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PromoProgressBars } from "#/modules/promo/components/promo-progress-bars.tsx";

describe("PromoProgressBars", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when there is a single slide", () => {
    const { container } = render(
      <PromoProgressBars count={1} activeIndex={0} playing={true} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders one segment per slide, marking prior segments complete and later ones upcoming", () => {
    const { container } = render(
      <PromoProgressBars count={3} activeIndex={1} playing={true} />,
    );

    const segments = container.querySelectorAll("[data-progress-state]");
    expect(segments).toHaveLength(3);
    expect(segments[0].getAttribute("data-progress-state")).toBe("complete");
    expect(segments[1].getAttribute("data-progress-state")).toBe("active");
    expect(segments[2].getAttribute("data-progress-state")).toBe("upcoming");
  });

  it("hides the progress bars from assistive tech", () => {
    const { container } = render(
      <PromoProgressBars count={2} activeIndex={0} playing={true} />,
    );

    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
