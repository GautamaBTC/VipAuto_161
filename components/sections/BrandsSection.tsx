import { brands } from "@/data/brands";

export function BrandsSection() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <h2 className="text-2xl font-bold sm:text-3xl">С какими марками работаем</h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          Европейские, корейские, японские и китайские автомобили. Подбираем решения под конкретную платформу.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <span key={brand.id} className="rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)]">
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
