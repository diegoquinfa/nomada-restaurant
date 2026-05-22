const scheduleRows = [
  {
    days: "Lunes – Jueves",
    hours: ["11:00 – 14:00", "18:00 – 22:00"],
    note: "Dos turnos",
  },
  {
    days: "Viernes – Domingo",
    hours: ["11:00 – 22:00"],
    note: "Corrido",
  },
];

export function HomeSchedule() {
  return (
    <section id="horarios" className="bg-nomada-cream py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-nomada-earth/50" />
            <span className="font-sans text-nomada-earth text-[10px] tracking-[0.4em] uppercase">
              Disponibilidad
            </span>
            <div className="w-8 h-px bg-nomada-earth/50" />
          </div>
          <h2 className="font-serif text-nomada-deep text-4xl md:text-5xl font-light leading-tight text-balance">
            Horarios de atención
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h3 className="font-sans text-nomada-earth text-[10px] tracking-[0.4em] uppercase mb-8">
              Horario de atención
            </h3>
            <div className="flex flex-col divide-y divide-nomada-earth/15">
              {scheduleRows.map((row) => (
                <div key={row.days} className="flex flex-col gap-3 py-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-serif text-nomada-deep text-[17px]">
                      {row.days}
                    </p>
                    <p className="font-sans text-nomada-earth text-[11px] tracking-[0.15em]">
                      {row.note}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.hours.map((h) => (
                      <span
                        key={h}
                        className="font-sans text-nomada-deep text-[13px] tracking-wide bg-nomada-earth/10 px-3.5 py-1"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="font-sans text-nomada-deep/50 text-[13px] leading-relaxed mt-6 border-t border-nomada-earth/15 pt-6">
              * Los pedidos se reciben hasta 30 minutos antes del cierre.
              Delivery a domicilio en toda Cartagena.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-nomada-earth text-[10px] tracking-[0.4em] uppercase mb-8">
              Zona de cobertura
            </h3>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-nomada-earth shrink-0" />
                <span className="font-sans text-nomada-deep/80 text-[14px]">
                  Toda Cartagena
                </span>
              </div>
            </div>
            {/*<div className="border-t border-nomada-earth/15 pt-6">
              <p className="font-sans text-nomada-deep/50 text-[11px] tracking-[0.2em] uppercase mb-4">
                También disponible en
              </p>
              <div className="flex gap-4">
                {["Rappi", "iFood"].map((platform) => (
                  <span
                    key={platform}
                    className="font-sans text-nomada-deep text-[12px] tracking-[0.15em] uppercase border border-nomada-earth/30 px-4 py-2"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    </section>
  );
}
