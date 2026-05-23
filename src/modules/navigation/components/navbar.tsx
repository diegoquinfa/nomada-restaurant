import { cn } from "#/shared/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { WhatsAppLink } from "./whatsapp-link";
import { scrollToHash } from "../utils/scroll-to-hash";
import { Image } from "@unpic/react";

const navLinks = [
  { label: "Nosotros", href: "nosotros" },
  { label: "Menú", href: "menu" },
  { label: "Cómo pedir", href: "como-pedir" },
  { label: "Horarios", href: "horarios" },
  { label: "Contacto", href: "contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClose = () => setMenuOpen(false);

  // Toggle body class for WhatsAppFAB z-index
  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", menuOpen);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled
              ? "bg-nomada-deep/95 backdrop-blur-sm border-b border-nomada-gold/20"
              : "bg-transparent"
          }`,
        )}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            {/*<span className="font-serif text-nomada-cream text-xl tracking-[0.25em] uppercase font-medium">
              NÓMADA
            </span>
            <span className="font-sans text-nomada-gold text-[9px] tracking-[0.35em] uppercase mt-0.5">
              Cocina Fusión
            </span>*/}

            <Image
              layout="fixed"
              src="/images/logo-sm.webp"
              alt="NÓMADA Logo"
              className={cn(
                "transition-opacity duration-300",
                !scrolled ? "opacity-0 pointer-events-none" : "opacity-100",
              )}
              height={39}
              width={158}
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to="/"
                hash={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(link.href);
                }}
                className="font-sans text-nomada-cream/70 text-[11px] tracking-[0.2em] uppercase hover:text-nomada-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <WhatsAppLink className="font-arial font-extrabold! text-nomada-deep text-[11px] tracking-[0.2em] uppercase bg-nomada-gold px-5 py-2.5 hover:bg-nomada-cream transition-colors duration-200">
              Pedir ahora
            </WhatsAppLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                `w-6 h-px bg-nomada-cream transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.25" : ""}`,
              )}
            />
            <span
              className={cn(
                `w-6 h-px bg-nomada-cream transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`,
              )}
            />
            <span
              className={cn(
                `w-6 h-px bg-nomada-cream transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.25" : ""}`,
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-nomada-deep flex flex-col items-center justify-center transition-all duration-400 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col items-center gap-8"
          aria-label="Navegación móvil"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              to="/"
              hash={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToHash(link.href);
                handleClose();
              }}
              className="font-serif text-nomada-cream text-3xl italic tracking-wide hover:text-nomada-gold transition-colors duration-200"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppLink
            onClick={handleClose}
            className="mt-4 font-sans text-white font-bold inline-block text-[12px] tracking-[0.2em] uppercase bg-nomada-gold px-8 py-4"
          >
            Pedir ahora
          </WhatsAppLink>
        </nav>
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar menú"
          className="absolute top-6 right-6 text-nomada-cream/60 hover:text-nomada-cream"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>{" "}
      </div>
    </>
  );
}
