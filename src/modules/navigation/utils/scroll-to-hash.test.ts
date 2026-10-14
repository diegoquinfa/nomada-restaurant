import { describe, expect, it } from "vitest";

import { hashFromUrl } from "#/modules/navigation/utils/scroll-to-hash.ts";

describe("hashFromUrl", () => {
  it("extracts the hash from a same-page CMS url", () => {
    expect(hashFromUrl("/#menu")).toBe("menu");
    expect(hashFromUrl("/#como-pedir")).toBe("como-pedir");
    expect(hashFromUrl("#horarios")).toBe("horarios");
  });

  it("returns null when the url has no hash", () => {
    expect(hashFromUrl("/")).toBeNull();
    expect(hashFromUrl("https://example.com/contacto")).toBeNull();
  });

  it("returns null for an empty hash", () => {
    expect(hashFromUrl("/#")).toBeNull();
  });
});
