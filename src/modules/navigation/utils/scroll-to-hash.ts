/**
 * Scroll suavemente a una sección por su hash, con offset del navbar fixed.
 *
 * Resuelve el problema de que TanStack Router no re-navega cuando ya estás
 * en la misma ruta + hash, y también compensa el navbar fixed que tapa el
 * inicio de la sección.
 */
export function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (!el) return;

  const navbar = document.querySelector("header");
  const offset = navbar?.offsetHeight ?? 72;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
  history.replaceState(null, "", `#${hash}`);
}
