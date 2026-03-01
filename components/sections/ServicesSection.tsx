import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding">
      <div className="container-shell">
        <h2 className="text-2xl font-bold sm:text-3xl">Основные услуги</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="card-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{service.leadTime}</p>
                {service.popular ? <span className="rounded-full bg-[var(--accent)] px-2 py-1 text-xs">Популярно</span> : null}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{service.description}</p>
              <p className="mt-3 font-mono text-[var(--accent-2)]">{service.price}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <li key={feature} className="rounded-full border border-white/15 px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
