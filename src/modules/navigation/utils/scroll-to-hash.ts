/**
 * Scroll suavemente a una sección por su hash, con offset del chrome fixed.
 *
 * Sin TanStack Router: cada link lleva un `href` real (por ejemplo
 * `/#menu`) y el hash se resuelve en el cliente antes de hacer scroll.
 */
export function hashFromUrl(url: string): string | null {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return null;

  const hash = url.slice(hashIndex + 1);
  return hash.length > 0 ? hash : null;
}

export function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (!el) return;

  const navbar = document.querySelector("header");
  const offset = navbar?.getBoundingClientRect().bottom ?? 72;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
  history.replaceState(null, "", `#${hash}`);
}
