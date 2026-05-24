import { Image } from "@unpic/react";

export function HomeAbout() {
  return (
    <section id="nosotros" className="bg-nomada-primary py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image column */}
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                src="/images/assets/banner-about.webp"
                alt="Cocina artesanal NÓMADA — preparación gourmet en Cartagena"
                layout="constrained"
                width={800}
                height={1000}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle border accent */}
              <div className="absolute inset-0 border border-nomada-gold/20" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-1 md:-right-6 bg-nomada-earth px-5 py-3 border border-nomada-earth">
              <p className="font-sans text-nomada-cream text-[10px] tracking-[0.3em] uppercase">
                Cocina oculta · Cartagena
              </p>
            </div>
          </div>

          {/* Text column */}
          <div className="flex flex-col gap-8 md:pt-6">
            {/* Section label */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-nomada-gold/60" />
              <span className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase">
                Nuestra historia
              </span>
            </div>

            <h2 className="font-serif text-nomada-cream text-4xl md:text-5xl font-light leading-tight text-balance">
              Un sueño hecho <br />
              <span className="italic">con el corazón</span>
            </h2>

            <div className="w-8 h-px bg-nomada-gold/40" />

            <div className="flex flex-col gap-5">
              <p className="font-sans text-nomada-cream/80 leading-relaxed text-[15px]">
                Después de meses de ideas, pruebas, esfuerzo y muchísima pasión
                por la cocina… nace NÓMADA.
              </p>
              <p className="font-serif italic text-nomada-cream/70 text-xl leading-relaxed">
                Una cocina oculta creada para transformar el delivery en una
                experiencia: sabores intensos, cocina fusión y detalles pensados
                para disfrutarse desde casa.
              </p>
              <p className="font-sans text-nomada-cream/60 leading-relaxed text-[15px]">
                Este es apenas el comienzo de algo que soñamos construir con el
                corazón.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-2 border-t border-nomada-gold/20">
              <div>
                <p className="font-serif text-nomada-gold text-3xl">100%</p>
                <p className="font-sans text-nomada-cream/50 text-[11px] tracking-[0.2em] uppercase mt-1">
                  Artesanal
                </p>
              </div>
              <div className="w-px bg-nomada-gold/20" />
              <div>
                <p className="font-serif text-nomada-gold text-3xl">4</p>
                <p className="font-sans text-nomada-cream/50 text-[11px] tracking-[0.2em] uppercase mt-1">
                  Cocinas fusión
                </p>
              </div>
              <div className="w-px bg-nomada-gold/20" />
              <div>
                <p className="font-serif text-nomada-gold text-3xl">CTG</p>
                <p className="font-sans text-nomada-cream/50 text-[11px] tracking-[0.2em] uppercase mt-1">
                  Solo Cartagena
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
