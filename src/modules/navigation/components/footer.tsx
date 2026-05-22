import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WhatsAppLink } from "./whatsapp-link";
import { scrollToHash } from "../utils/scroll-to-hash";
import { Image } from "@unpic/react";

export function Footer() {
  const [year, setYear] = useState<number | undefined>(undefined);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-nomada-deep border-t border-nomada-gold/15 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          {/*<div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-nomada-cream text-lg tracking-[0.25em] uppercase">
              NÓMADA
            </span>
            <span className="font-sans text-nomada-gold text-[9px] tracking-[0.35em] uppercase mt-0.5">
              Cocina Fusión
            </span>
            <p className="font-sans text-nomada-cream/30 text-[12px] mt-2">
              Cartagena de Indias, Colombia
            </p>
          </div>*/}
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
            {[
              { label: "Nosotros", hash: "nosotros" },
              { label: "Menú", hash: "menu" },
              { label: "Cómo pedir", hash: "como-pedir" },
              { label: "Horarios", hash: "horarios" },
            ].map((link) => (
              <Link
                to="/"
                key={link.hash}
                hash={link.hash}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(link.hash);
                }}
                className="font-sans text-nomada-cream/50 text-[11px] tracking-[0.2em] uppercase hover:text-nomada-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/nomadarestaurante"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nomada-cream/40 hover:text-nomada-gold transition-colors duration-200"
            >
              <span className="sr-only">
                Ir al perfil de Instagram de Nómada Cartagena
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
            <WhatsAppLink className="text-nomada-cream/40 hover:text-nomada-gold transition-colors duration-200">
              <span className="sr-only">
                Ir al chat de WhatsApp de Nómada Cartagena
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
            © {year} NÓMADA. Todos los derechos reservados.
          </p>
          <p className="font-sans text-nomada-cream/20 text-[10px] tracking-[0.1em]">
            Hecho por{" "}
            <a
              href="https://diegoquinfa.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nomada-gold/40 hover:text-nomada-gold transition-colors duration-200"
            >
              Diego Quintana Fajardo
            </a>{" "}
            | Ingeniero de Software
          </p>
        </div>
      </div>
    </footer>
  );
}
