/* Aviso "Plato de Temporada": barra global dorada que aparece al pasar el hero
   (TemporadaTopBar) más una franja editorial con reveal on-scroll entre el hero
   y "Nosotros" (TemporadaStrip). La barra comunica su altura al navbar mediante
   la variable CSS --temporada-bar, definida sobre documentElement. */

import { useEffect, useRef, useState } from "react";
import { cn } from "#/shared/ui/lib/utils";

const LABEL = "Plato de Temporada";
const STATUS = "Muy pronto";
const EYEBROW = "Edición mensual";
const BAR_MSG =
  "PLATO DE TEMPORADA — una creación exclusiva que cambia cada 30 días";
const BODY_BEFORE =
  "Una creación exclusiva que cambia cada mes para sorprenderte con lo mejor de la despensa y nuevas exploraciones culinarias. ";
const BODY_HIGHLIGHT = "Cada 30 días";
const BODY_AFTER =
  " renovamos la receta con ingredientes de temporada y combinaciones inesperadas, disponibles solo por tiempo limitado. ";
const BODY_SIGNOFF = "Espéralo";

/* Barra global dorada fija arriba. Se desliza hacia abajo justo después de
   pasar el hero (scrollY > 75% del viewport) y se retira al volver arriba.
   Mientras es visible publica su altura en la variable CSS --temporada-bar,
   que el <header> del navbar usa como offset (ver navbar.tsx), y ajusta
   scroll-padding-top para que los anclajes por hash no queden tapados. */
export function TemporadaTopBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--temporada-bar",
      visible ? "2.25rem" : "",
    );
    document.documentElement.style.scrollPaddingTop = visible
      ? "calc(2.25rem + 5rem)"
      : "";
    return () => {
      document.documentElement.style.setProperty("--temporada-bar", "");
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, [visible]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed top-0 inset-x-0 z-[60] h-9 overflow-hidden bg-nomada-gold text-nomada-deep",
        "transition-[translate,opacity] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0 pointer-events-none",
      )}
    >
      <div className="relative flex h-full items-center justify-center gap-3 overflow-hidden whitespace-nowrap px-4">
        <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.25em] font-extrabold">
          ✦ {STATUS}
        </span>
        {/* Móvil: cartel desplazante en bucle. Desktop: línea estática. */}
        <div className="relative min-w-0 max-w-[62vw] flex-1 overflow-hidden md:hidden">
          <div className="flex w-max animate-temporada-marquee will-change-transform motion-reduce:animate-none">
            <span className="shrink-0 px-6 font-sans text-[11px]">
              {BAR_MSG}
            </span>
            <span aria-hidden className="shrink-0 px-6 font-sans text-[11px]">
              {BAR_MSG}
            </span>
          </div>
        </div>
        <p className="hidden min-w-0 truncate font-sans text-[11px] md:block">
          {BAR_MSG}
        </p>
        <span aria-hidden className="shrink-0 text-xs">
          ✦
        </span>
      </div>
      {/* Barrido de brillo sutil sobre el dorado; capa aparte para no difuminar el texto */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-temporada-shimmer bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.25)_50%,transparent_60%)] bg-[length:200%_100%]"
      />
    </div>
  );
}

/* Reveal-on-scroll: IntersectionObserver de un solo disparo que marca la
   sección como visible apenas entra en viewport y luego se desconecta. */
function useRevealOnScroll() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}

/* Franja dedicada entre el hero y "Nosotros": sección editorial centrada que
   se anuncia a sí misma al entrar en viewport con reveal escalonado
   (0/150/300/450 ms), mismo patrón de animación que el hero. */
export function TemporadaStrip() {
  const { ref, shown } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      className="relative bg-nomada-deep border-y border-nomada-gold/20 overflow-hidden"
    >
      {/* Profundidad ambiental: brillo radial dorado muy tenue tras el título */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.10),transparent_60%)]"
      />
      {/* Adornos de esquina: segmentos de filete dorado, como en los encabezados de la carta */}
      <span
        aria-hidden
        className="absolute bottom-0 left-6 h-px w-16 bg-nomada-gold"
      />
      <span
        aria-hidden
        className="absolute bottom-0 right-6 h-px w-16 bg-nomada-gold"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-14 text-center">
        {/* 1 — Eyebrow con hairlines espejadas (0 ms) */}
        <div
          className={cn(
            "flex items-center gap-4",
            shown
              ? "animate-fade-in-up [animation-delay:0ms] animation-duration-[800ms]"
              : "opacity-0 translate-y-6",
          )}
        >
          <div className="w-10 h-px bg-nomada-gold/60" />
          <span className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase font-semibold">
            {EYEBROW}
          </span>
          <div className="w-10 h-px bg-nomada-gold/60" />
        </div>

        {/* 2 — Título + pill "Muy pronto" con pulso lento (150 ms) */}
        <div
          className={cn(
            "mt-5 flex flex-wrap items-center justify-center gap-4",
            shown
              ? "animate-fade-in-up [animation-delay:150ms] animation-duration-[800ms]"
              : "opacity-0 translate-y-6",
          )}
        >
          <h2 className="font-serif text-nomada-cream text-3xl md:text-4xl font-light">
            {LABEL}
          </h2>
          <span className="animate-temporada-pulse rounded-full border border-nomada-gold/60 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.3em] text-nomada-gold">
            {STATUS}
          </span>
        </div>

        {/* 3 — Divisor ✦ con titileo suave (300 ms) */}
        <span
          aria-hidden
          className={cn(
            "my-5 text-sm text-nomada-gold",
            shown
              ? "animate-fade-in-up [animation-delay:300ms] animation-duration-[800ms]"
              : "opacity-0 translate-y-6",
          )}
        >
          <span className="animate-temporada-twinkle">✦</span>
        </span>

        {/* 4 — Copy con acentos dorados (450 ms) */}
        <p
          className={cn(
            "max-w-2xl font-sans text-nomada-cream/60 text-[13px] md:text-sm leading-relaxed",
            shown
              ? "animate-fade-in-up [animation-delay:450ms] animation-duration-[800ms]"
              : "opacity-0 translate-y-6",
          )}
        >
          {BODY_BEFORE}
          <span className="text-nomada-gold">{BODY_HIGHLIGHT}</span>
          {BODY_AFTER}
          <span className="font-serif italic text-nomada-gold">
            {BODY_SIGNOFF}
          </span>
        </p>
      </div>
    </section>
  );
}
