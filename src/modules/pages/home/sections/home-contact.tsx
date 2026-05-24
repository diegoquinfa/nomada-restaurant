import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";

export function HomeContact() {
  return (
    <section id="contacto" className="bg-nomada-primary py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-nomada-gold/60" />
            <span className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase">
              Hablemos
            </span>
            <div className="w-8 h-px bg-nomada-gold/60" />
          </div>
          <h2 className="font-serif text-nomada-cream text-4xl md:text-5xl font-light leading-tight text-balance">
            Contacto
          </h2>
          <p className="font-sans text-nomada-cream/60 text-[15px] leading-relaxed mt-4 max-w-md text-balance">
            Pedidos, consultas, pedidos especiales. Escríbenos cuando quieras —
            estamos aquí.
          </p>
        </div>

        <div className="grid gap-12 md:gap-20 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp */}
            <WhatsAppLink className="group flex items-start gap-5 p-6 border border-nomada-gold/20 hover:border-nomada-gold/50 transition-colors duration-300">
              <div className="text-nomada-gold mt-0.5 shrink-0">
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
              </div>
              <div>
                <p className="font-sans text-nomada-gold text-[10px] tracking-[0.3em] uppercase mb-1">
                  WhatsApp
                </p>
                <p className="font-serif text-nomada-cream text-xl group-hover:text-nomada-gold transition-colors duration-200">
                  +57 324 250 3301
                </p>
                <p className="font-sans text-nomada-cream/40 text-[12px] mt-1">
                  Pedidos y consultas
                </p>
              </div>
            </WhatsAppLink>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/nomadarestaurante"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-5 p-6 border border-nomada-gold/20 hover:border-nomada-gold/50 transition-colors duration-300"
            >
              <div className="text-nomada-gold mt-0.5 shrink-0">
                <svg
                  width="20"
                  height="20"
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
              </div>
              <div>
                <p className="font-sans text-nomada-gold text-[10px] tracking-[0.3em] uppercase mb-1">
                  Instagram
                </p>
                <p className="font-serif text-nomada-cream text-xl group-hover:text-nomada-gold transition-colors duration-200">
                  @nomadarestaurante
                </p>
                <p className="font-sans text-nomada-cream/40 text-[12px] mt-1">
                  Fotos, novedades y más
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
