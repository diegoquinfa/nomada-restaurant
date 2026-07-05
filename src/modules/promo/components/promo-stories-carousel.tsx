import {
  BlossomCarousel,
  type BlossomCarouselHandle,
} from "@blossom-carousel/react";
import { Image } from "@unpic/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef } from "react";

import { PromoProgressBars } from "#/modules/promo/components/promo-progress-bars.tsx";
import { useActiveSlideIndex } from "#/modules/promo/hooks/use-active-slide-index.ts";
import { useStoriesAutoplay } from "#/modules/promo/hooks/use-stories-autoplay.ts";
import type { PromoSlide } from "#/modules/promo/lib/promo-slides.ts";

const IMAGE_STYLE = {
  width: "auto",
  height: "auto",
  maxWidth: "100%",
  maxHeight: "85vh",
} as const;

const ARROW_BUTTON_CLASS =
  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:bg-black/60 disabled:opacity-40 disabled:hover:bg-black/40";

const SLIDE_SELECTOR = "[data-blossom-slide]";

type PromoStoriesCarouselProps = {
  slides: PromoSlide[];
};

function PromoSlideImage({ slide }: { slide: PromoSlide }) {
  return (
    <Image
      layout="constrained"
      src={slide.image.src}
      alt={slide.image.alt}
      width={1125}
      height={2000}
      className="mx-auto block rounded-lg"
      // @unpic/react's public ImageProps type omits `style`, but its
      // runtime (@unpic/core transformBaseImageProps) merges any passed
      // style over its own computed width/height/aspect-ratio style. This
      // override is required so our explicit auto/max sizing wins.
      // @ts-expect-error -- style is intentionally passed despite the omission (see above).
      style={IMAGE_STYLE}
    />
  );
}

/**
 * Presentational Instagram-stories-style carousel for aggregated promo
 * slides. Renders a bare image with no controls for a single slide;
 * otherwise wires Blossom navigation, custom active-index tracking, and
 * the autoplay/progress-bar pair.
 */
export function PromoStoriesCarousel({ slides }: PromoStoriesCarouselProps) {
  const carouselId = useId();
  const elementRef = useRef<HTMLElement | null>(null);
  const activeIndex = useActiveSlideIndex(elementRef, slides.length);
  const { playing, markInteracted } = useStoriesAutoplay(
    elementRef,
    activeIndex,
    slides.length,
  );

  const setCarouselHandle = useCallback(
    (handle: BlossomCarouselHandle | null) => {
      elementRef.current = handle?.element ?? null;
    },
    [],
  );

  // Navigation uses scrollIntoView on the slide elements (same mechanism as
  // autoplay) instead of BlossomPrev/BlossomNext: Blossom caches slide
  // positions from getBoundingClientRect on mount, which runs while the Radix
  // dialog's zoom-in animation is still scaling the content, so its buttons
  // resolve the wrong target slide.
  const goToSlide = useCallback((index: number) => {
    const element = elementRef.current;
    if (!element) return;

    const slides = element.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
    slides[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }, []);

  // Blossom's desktop drag engine snaps to slide positions it measured while
  // the dialog's zoom-in animation was still scaling the content, so drags
  // can settle a few pixels short of a slide boundary. Re-align to the
  // nearest slide once scrolling ends; when scroll already sits on a slide
  // (buttons, autoplay, native touch snap) this is a no-op.
  useEffect(() => {
    const element = elementRef.current;
    if (!element || slides.length <= 1) return;

    const settle = () => {
      const nodes = element.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
      let nearest: HTMLElement | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        const distance = Math.abs(node.offsetLeft - element.scrollLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = node;
        }
      }
      if (nearest && nearestDistance > 1) {
        nearest.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "nearest",
        });
      }
    };

    element.addEventListener("scrollend", settle);
    return () => element.removeEventListener("scrollend", settle);
  }, [slides.length]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <section
        className="relative overflow-hidden rounded-lg"
        aria-roledescription="carrusel"
        aria-label="Promociones"
      >
        <PromoSlideImage slide={slides[0]} />
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden rounded-lg"
      aria-roledescription="carrusel"
      aria-label="Promociones"
      onPointerDown={markInteracted}
      onKeyDown={markInteracted}
    >
      {/* Blossom only enables snapping when the carousel's computed
          scroll-snap-type is not "none", so the root must declare it and
          every slide needs a snap alignment for the anchor points. */}
      <BlossomCarousel
        id={carouselId}
        ref={setCarouselHandle}
        className="snap-x snap-mandatory"
      >
        {slides.map((slide, index) => (
          // biome-ignore lint/a11y/useSemanticElements: role="group" + aria-roledescription="diapositiva" is the WAI-ARIA APG carousel-slide pattern; <fieldset> is a form-grouping element and would be semantically wrong here.
          <div
            key={`${slide.promoId}-${slide.image.src}`}
            data-blossom-slide
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${slides.length}`}
            className="w-full flex-none snap-start"
          >
            <PromoSlideImage slide={slide} />
          </div>
        ))}
      </BlossomCarousel>

      <PromoProgressBars
        count={slides.length}
        activeIndex={activeIndex}
        playing={playing}
      />

      <button
        type="button"
        aria-label="Imagen anterior"
        aria-controls={carouselId}
        disabled={activeIndex <= 0}
        onClick={() => {
          markInteracted();
          goToSlide(activeIndex - 1);
        }}
        className={`${ARROW_BUTTON_CLASS} left-2`}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Siguiente imagen"
        aria-controls={carouselId}
        disabled={activeIndex >= slides.length - 1}
        onClick={() => {
          markInteracted();
          goToSlide(activeIndex + 1);
        }}
        className={`${ARROW_BUTTON_CLASS} right-2`}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
