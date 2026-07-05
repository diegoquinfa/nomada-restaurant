// Vitest/jsdom setup shared by every test file.
// jsdom does not implement ResizeObserver, and its scrollIntoView throws
// "Not implemented" — both are required by @blossom-carousel/react's
// BlossomPrev/BlossomNext controls and our custom scroll-based hooks.

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// Blossom's arrow-button fallback navigation (no scroll-snap-align computed
// in jsdom, since no stylesheet is applied) calls Element.scrollBy directly.
if (typeof Element.prototype.scrollBy !== "function") {
  Element.prototype.scrollBy = function scrollBy() {};
}

// BlossomCarousel checks `window.matchMedia("(hover: hover) and (pointer:
// fine)")` in an effect on every mount to decide whether to load its drag
// engine. jsdom has no matchMedia implementation at all, so every test that
// renders BlossomCarousel (directly or via PromoStoriesCarousel) needs a
// default stub. Individual tests may override this (e.g. to simulate
// prefers-reduced-motion) by reassigning window.matchMedia themselves.
if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
