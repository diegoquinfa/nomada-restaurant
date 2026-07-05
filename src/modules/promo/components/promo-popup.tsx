import { PromoStoriesCarousel } from "#/modules/promo/components/promo-stories-carousel.tsx";
import { usePromoPopupVisibility } from "#/modules/promo/hooks/use-promo-popup-visibility.ts";
import { aggregatePromoSlides } from "#/modules/promo/lib/promo-slides.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "#/shared/ui/components/dialog.tsx";

export function PromoPopup() {
  const { open, activePromos, dismiss } = usePromoPopupVisibility();
  const slides = aggregatePromoSlides(activePromos);

  if (slides.length === 0) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
      }}
    >
      <DialogContent
        aria-label="Promo Nómada"
        className="max-w-sm border-none bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Promociones Nómada</DialogTitle>
        <DialogDescription className="sr-only">
          Promociones activas del día
        </DialogDescription>

        <PromoStoriesCarousel slides={slides} />
      </DialogContent>
    </Dialog>
  );
}
