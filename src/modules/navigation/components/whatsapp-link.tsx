import type { AnchorHTMLAttributes } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "#/shared/ui/lib/utils";

export const WHATSAPP_URL = new URL("https://wa.me/573242503301");

type WhatsAppLinkProps = {
  message?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const WhatsAppLink = ({
  message = "Hola, quiero vivir la experiencia NÓMADA 🌎",
  className,
  children,
  ...props
}: WhatsAppLinkProps) => {
  const queryParams = new URLSearchParams({
    text: message,
  });

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${WHATSAPP_URL.toString()}?${queryParams.toString()}`}
      aria-label="Pedir por WhatsApp"
      className={cn(className)}
      {...props}
    >
      {children}
    </a>
  );
};

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.body.classList.contains("nav-menu-open");
}

export function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  const menuOpen = useSyncExternalStore(subscribe, getSnapshot, () => false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <WhatsAppLink
      className={cn(
        `fixed bottom-6 right-6 flex items-center gap-3 bg-nomada-gold text-nomada-deep px-4 py-3 shadow-lg hover:bg-nomada-cream transition-all duration-300 md:hidden ${
          menuOpen ? "z-30" : "z-50"
        } ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`,
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      <span className="font-sans text-[11px] tracking-[0.2em] uppercase">
        Pedir ahora
      </span>
    </WhatsAppLink>
  );
}
