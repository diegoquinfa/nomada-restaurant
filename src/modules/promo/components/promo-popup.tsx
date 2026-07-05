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
        <DialogTitle className="sr-only">Nueva Burguer</DialogTitle>
        <DialogDescription className="sr-only">
          Hamburguesa de camarón llena de sabores inolvidables, ¿te atreverias a
          probar?
        </DialogDescription>
        <Image
          layout="constrained"
          src="/images/promo/promo-0002.webp"
          alt="Hamburguesa de camarón llena de sabores inolvidables"
          width={1125}
          height={2000}
          className="max-h-[85vh] w-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
