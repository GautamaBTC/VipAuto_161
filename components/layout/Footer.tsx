import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10 pb-24 md:pb-10">
      <div className="container-shell grid gap-6 text-sm text-[var(--text-secondary)] md:grid-cols-2">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{siteConfig.brand}</p>
          <p>{siteConfig.specialization}</p>
          <p className="mt-2">{siteConfig.address}</p>
          <p className="mt-2">Email: {siteConfig.email}</p>
          <p className="mt-3">© 2016-{year} VIPAuto · ИП · ОГРНИП {siteConfig.ogrnip}</p>
        </div>
        <div className="md:text-right">
          <p>ОГРНИП: {siteConfig.ogrnip}</p>
          <p>ИНН: {siteConfig.inn}</p>
          <p>ОКПО: {siteConfig.okpo}</p>
          <p className="mt-1">{siteConfig.schedule}</p>
          <div className="mt-3 flex gap-3 md:justify-end">
            <a href="/privacy" className="hover:text-[var(--text-primary)]">
              Политика
            </a>
            <a href="/terms" className="hover:text-[var(--text-primary)]">
              Оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
