import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";

const steps = [
  {
    number: "01",
    title: "Explora el menú",
    description:
      "Navega por nuestras categorías y elige los platos que más te llamen. Arroces, pastas, mariscos o grill.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Escríbenos por WhatsApp",
    description:
      "Mándanos un mensaje con tu pedido, dirección de entrega y hora preferida. Respondemos de inmediato.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recibe en casa",
    description:
      "Tu pedido es una experiencia única, empacado con cuidado para que cada plato llegue perfecto.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export function HomeHowToOrder() {
  return (
    // Reducido de py-24 a py-12 en mobile para compactar el inicio y fin de la sección
    <section id="como-pedir" className="bg-nomada-deep py-12 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        {/* Reducido el margen inferior del encabezado en mobile (mb-10) */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-8 h-px bg-nomada-gold/60" />
            <span className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase">
              Es muy sencillo
            </span>
            <div className="w-8 h-px bg-nomada-gold/60" />
          </div>
          <h2 className="font-serif text-nomada-cream text-3xl md:text-5xl font-light leading-tight text-balance">
            Cómo hacer tu pedido
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-0 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%)] right-[calc(16.66%)] h-px bg-nomada-gold/20" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              // Reducido de py-8 a py-4 en mobile para acercar los elementos verticalmente
              className="flex flex-col items-center text-center px-6 py-4 md:py-8"
            >
              {/* Circle with number */}
              {/* Reducido el margen inferior del icono en mobile (mb-4) */}
              <div className="relative z-10 w-20 h-20 border border-nomada-gold/40 flex items-center justify-center mb-4 md:mb-6 bg-nomada-deep">
                <span className="text-nomada-gold">{step.icon}</span>
              </div>

              <span className="font-sans text-nomada-gold/40 text-[10px] tracking-[0.4em] uppercase mb-2 md:mb-3">
                {step.number}
              </span>
              <h3 className="font-serif text-nomada-cream text-2xl mb-2 md:mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-nomada-cream/50 text-[14px] leading-relaxed max-w-xs">
                {step.description}
              </p>

              {/* Arrow between steps — mobile */}
              {/* Reducido significativamente el margen de la flecha (mt-4 mb-0) para que actúe de conector directo */}
              {i < steps.length - 1 && (
                <div className="md:hidden mt-4 mb-0 text-nomada-gold/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delivery time + CTA */}
        {/* Ajustado el margen y padding superior en mobile (mt-8 pt-8) */}
        <div className="flex flex-col items-center gap-6 mt-8 md:mt-14 border-t border-nomada-gold/15 pt-8 md:pt-14">
          <WhatsAppLink className="font-sans text-nomada-deep text-[12px] tracking-[0.3em] uppercase bg-nomada-gold px-12 py-5 hover:bg-nomada-cream transition-colors duration-300 w-full sm:w-auto text-center">
            Hacer mi pedido
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
