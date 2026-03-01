export function CompareSection() {
  return (
    <section id="compare" className="section-padding">
      <div className="container-shell">
        <h2 className="text-2xl font-bold sm:text-3xl">Обычный гараж vs VIPАвто</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="card-surface border-yellow-400/20 p-5">
            <p className="text-sm uppercase tracking-widest text-yellow-300/80">Гаражный подход</p>
            <ul className="mt-3 space-y-2 text-[var(--text-secondary)]">
              <li>• Замена деталей без поиска первопричины</li>
              <li>• Неясные сроки и стоимость по факту</li>
              <li>• Нестабильный результат на сложной электрике</li>
            </ul>
          </article>
          <article className="card-surface border-green-400/30 p-5">
            <p className="text-sm uppercase tracking-widest text-green-300/90">Подход VIPАвто</p>
            <ul className="mt-3 space-y-2 text-[var(--text-secondary)]">
              <li>• Диагностика цепей и блоков под нагрузкой</li>
              <li>• Прозрачное согласование до старта ремонта</li>
              <li>• Контрольная проверка перед выдачей автомобиля</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
