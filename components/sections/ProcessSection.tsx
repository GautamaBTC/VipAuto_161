import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section id="process" className="section-padding">
      <div className="container-shell">
        <h2 className="text-2xl font-bold sm:text-3xl">Как мы работаем</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {processSteps.map((step) => (
            <li key={step.id} className="card-surface relative p-5">
              <p className="font-mono text-sm text-[var(--text-secondary)]">Шаг {step.id}</p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
