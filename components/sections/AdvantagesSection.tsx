import { advantages } from "@/data/advantages";

export function AdvantagesSection() {
  return (
    <section id="advantages" className="section-padding">
      <div className="container-shell">
        <h2 className="text-2xl font-bold sm:text-3xl">Почему выбирают VIPАвто</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {advantages.map((advantage) => (
            <article key={advantage.id} className="card-surface p-5">
              <h3 className="text-lg font-semibold">{advantage.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{advantage.description}</p>
              {advantage.stat ? <p className="mt-3 font-mono text-[var(--accent-2)]">{advantage.stat}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
