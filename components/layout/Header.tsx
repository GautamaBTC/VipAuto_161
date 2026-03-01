"use client";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { MobileNav } from "@/components/navigation/MobileNav";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "#compare", label: "Сравнение" },
  { href: "#services", label: "Услуги" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#process", label: "Процесс" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const direction = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[150] border-b border-white/10 bg-[rgba(9,13,18,0.75)] backdrop-blur-xl transition-transform duration-300",
        direction === "down" ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-1 text-lg font-bold tracking-tight">
          <span className="text-white">VIP</span>
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            Авто
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm text-white/55 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/85"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.social.whatsapp}
            className="hidden rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold transition hover:brightness-110 sm:inline-flex lg:hidden"
          >
            Записаться
          </a>
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
