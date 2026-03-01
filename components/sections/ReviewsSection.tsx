import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/siteConfig";

export function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding">
      <div className="container-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Отзывы клиентов</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Яндекс Карты: {siteConfig.rating} ({siteConfig.ratingVotes} оценок)
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="card-surface p-5">
              <p className="text-sm text-[var(--text-secondary)]">
                {"★".repeat(review.rating)} <span className="ml-1">{review.car}</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                {review.service} • {review.date}
              </p>
              <p className="mt-3">{review.text}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
