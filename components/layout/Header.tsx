"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  { href: "#compare", label: "Сравнение" },
  { href: "#services", label: "Услуги" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#process", label: "Процесс" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const direction = useScrollDirection();

  useLockScroll(open);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[rgba(9,13,18,0.85)] backdrop-blur-md transition-transform duration-300",
          direction === "down" ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="container-shell flex h-14 items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">
            <span className="accent-dot" />
            {siteConfig.brand}
          </a>
          <nav className="hidden items-center gap-5 text-sm text-[var(--text-secondary)] lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-[var(--text-primary)]">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.social.whatsapp}
              className="hidden rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold transition hover:brightness-110 sm:inline-flex"
            >
              Записаться
            </a>
            <button
              type="button"
              aria-label="Открыть меню"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-lg lg:hidden"
            >
              ☰
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={open} onClose={() => setOpen(false)} navItems={navItems} />
    </>
  );
}
