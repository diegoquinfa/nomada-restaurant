import { Image } from "@unpic/react";
import { useState } from "react";
import type { NavLink } from "#/modules/navigation/types";
import {
  hashFromUrl,
  scrollToHash,
} from "#/modules/navigation/utils/scroll-to-hash";
import { WhatsAppLink } from "./whatsapp-link";

type FooterProps = {
  links: NavLink[];
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  location: string;
  legalName: string;
};

export function Footer({
  links,
  whatsappNumber,
  whatsappMessage,
  instagramHandle,
  location,
  legalName,
}: FooterProps) {
  const [year] = useState(() => new Date().getFullYear());

  const instagramUrl = `https://www.instagram.com/${instagramHandle.replace(
    /^@/,
    "",
  )}`;

  return (
    <footer className="bg-nomada-deep border-t border-nomada-gold/15 pt-12 pb-20 md:pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            layout="fixed"
            src="/images/logo-sm.webp"
            alt="NÓMADA Logo"
            className=""
            height={80}
            width={325}
          />

          {/* Nav links */}
          <nav
            className="flex flex-wrap justify-center gap-6"
            aria-label="Footer navigation"
          >
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                onClick={(event) => {
                  const hash = hashFromUrl(link.url);
                  if (!hash) return;

                  event.preventDefault();
                  scrollToHash(hash);
                }}
                className="font-sans text-nomada-cream/50 text-[11px] tracking-[0.2em] uppercase hover:text-nomada-gold transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nomada-cream/40 hover:text-nomada-gold transition-colors duration-200"
            >
              <span className="sr-only">
                Ir al perfil de Instagram de {legalName} Cartagena
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <WhatsAppLink
              whatsappNumber={whatsappNumber}
              whatsappMessage={whatsappMessage}
              className="text-nomada-cream/40 hover:text-nomada-gold transition-colors duration-200"
            >
              <span className="sr-only">
                Ir al chat de WhatsApp de {legalName} Cartagena
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </WhatsAppLink>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-nomada-gold/10 mt-8 pt-8 flex flex-col items-center gap-1">
          <p className="font-sans text-nomada-cream/25 text-[11px] tracking-[0.15em] text-center">
            © {year} {legalName} — {location}. Todos los derechos reservados.
          </p>
          <p className="font-sans text-nomada-cream/20 text-[10px] tracking-widest">
            Página desarrollada por{" "}
            <a
              href="https://diegoquinfa.lat?utm_source=nomada&utm_medium=footer&utm_campaign=site_credit"
              target="_blank"
              rel="noopener"
              className="text-nomada-gold/40 hover:text-nomada-gold transition-colors duration-200"
            >
              Diego Quintana Fajardo
            </a>{" "}
            | Ingeniero de Sistemas y Computación
          </p>
        </div>
      </div>
    </footer>
  );
}
