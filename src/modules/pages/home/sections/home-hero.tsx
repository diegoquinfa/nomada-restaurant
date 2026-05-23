import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export function HomeHero() {
  return (
    <section
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero NÓMADA Cocina Fusión"
    >
      <div className="absolute inset-0 w-full h-min-dvh -z-10">
        <Image
          layout="fullWidth"
          src="/images/assets/hero-bg.webp"
          alt="Plato gourmet delivery NÓMADA — Cocina Fusión Cartagena"
          className="object-cover object-center w-full h-dvh blur-sm"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-nomada-primary/80" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Logo wordmark */}
        <div className="animate-fade-in [animation-delay:100ms] animation-duration-[600ms] mb-6">
          <p className="font-sans text-nomada-gold text-[10px] tracking-[0.5em] uppercase mb-2">
            Cartagena de Indias
          </p>
          <Image
            layout="fullWidth"
            src="/images/logo.webp"
            alt="NÓMADA Cocina Fusión"
            aria-label="NÓMADA Cocina Fusión"
            className="w-max-full"
            fetchpriority="high"
          />
        </div>

        {/* Gold divider */}
        <div className="animate-fade-in [animation-delay:300ms] animation-duration-[600ms] w-10 h-px bg-nomada-gold/70 my-7" />

        {/* Headline */}
        <h2 className="animate-fade-in-up [animation-delay:400ms] animation-duration-[800ms] font-serif text-nomada-cream text-2xl md:text-3xl font-light leading-relaxed text-balance">
          Bienvenidos a la experiencia NÓMADA
        </h2>

        {/* Subheadline */}
        <h1 className="animate-fade-in-up [animation-delay:500ms] animation-duration-[800ms] font-serif italic text-nomada-cream/70 text-lg md:text-xl leading-relaxed mt-4 text-balance">
          Un restaurante cocina oculta creado para transformar el delivery en
          una experiencia gourmet en Cartagena
        </h1>

        {/* CTAs */}
        <div className="animate-fade-in-up [animation-delay:600ms] animation-duration-[800ms] flex flex-col sm:flex-row items-center gap-4 mt-10">
          <WhatsAppLink className="font-sans text-nomada-deep text-[11px] tracking-[0.25em] uppercase bg-nomada-gold px-10 py-4 hover:bg-nomada-cream transition-colors duration-300 w-full sm:w-auto text-center">
            Pedir ahora
          </WhatsAppLink>

          <Link
            to="/"
            hash="menu"
            className="font-sans text-nomada-cream text-[11px] tracking-[0.25em] uppercase border border-nomada-gold/50 px-10 py-4 hover:border-nomada-gold hover:text-nomada-gold transition-colors duration-300 w-full sm:w-auto text-center"
          >
            Ver menú
          </Link>
        </div>

        {/* Categories */}
        <div className="animate-fade-in [animation-delay:800ms] animation-duration-[600ms] flex flex-wrap justify-center gap-x-5 gap-y-2 mt-12">
          {["Entradas y Arroces", "Recomendados del Chef", "Pastas", "Caseritos del Chef"].map((cat, i) => (
            <span key={cat} className="flex items-center gap-5">
              <span className="font-sans text-nomada-gold text-[10px] tracking-[0.35em] uppercase">
                {cat}
              </span>
              {i < 3 && <span className="text-nomada-gold/40 text-xs">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in [animation-delay:800ms] animation-duration-[600ms]">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-nomada-cream/40 text-[9px] tracking-[0.3em] uppercase">
            Explorar
          </span>
          <div className="w-px h-10 bg-nomada-gold/30" />
        </div>
      </div>
    </section>
  );
}
