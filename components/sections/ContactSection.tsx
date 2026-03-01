import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/siteConfig";

export function ContactSection() {
  return (
    <section id="contacts" className="section-padding">
      <div className="container-shell">
        <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
          <article className="card-surface p-6 md:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Контакты и запись</h2>
            <p className="mt-3 text-[var(--text-secondary)]">{siteConfig.address}</p>
            <p className="mt-2 text-[var(--text-secondary)]">{siteConfig.schedule}</p>
            <ul className="mt-4 space-y-2 text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={siteConfig.social.telegram} className="rounded-lg border border-white/20 px-4 py-2">
                Telegram
              </a>
              <a href={siteConfig.social.whatsapp} className="rounded-lg border border-white/20 px-4 py-2">
                WhatsApp
              </a>
              <a href={siteConfig.yandexMaps} className="rounded-lg border border-white/20 px-4 py-2">
                Яндекс Карты
              </a>
            </div>
          </article>
          <article className="card-surface p-6 md:p-8">
            <h3 className="text-xl font-semibold">Оставьте заявку</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Ответим в рабочее время и согласуем удобную дату визита.
            </p>
            <div className="mt-4">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
