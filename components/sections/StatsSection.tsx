import { stats } from "@/data/stats";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function StatsSection() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <article key={item.id} className="card-surface p-5">
              <AnimatedCounter value={item.value} suffix={item.suffix} />
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
