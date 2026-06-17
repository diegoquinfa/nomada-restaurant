import { Image } from "@unpic/react";
import { usePromoPopupVisibility } from "#/modules/promo/hooks/use-promo-popup-visibility.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "#/shared/ui/components/dialog.tsx";

export function PromoPopup() {
  const { open, dismiss } = usePromoPopupVisibility();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
      }}
    >
      <DialogContent
        aria-label="Promo Mundialista Nómada"
        className="max-w-sm border-none bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Promo Mundialista Nómada</DialogTitle>
        <DialogDescription className="sr-only">
          Promo Mundialista: Jalea de Marisco por solo $35.000, disponible de
          6:00pm a 8:00pm.
        </DialogDescription>
        <Image
          layout="constrained"
          src="/images/promo/promo-0001.webp"
          alt="Promo Mundialista Nómada — Jalea de Marisco por $35.000, disponible de 6:00pm a 8:00pm"
          width={1125}
          height={2000}
          className="max-h-[85vh] w-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
