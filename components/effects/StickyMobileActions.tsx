"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export function StickyMobileActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-3 left-0 right-0 z-30 px-3 transition md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-[rgba(9,13,18,0.94)] p-2 backdrop-blur-md">
        <a href={`tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`} className="rounded-xl border border-white/15 px-3 py-3 text-center font-semibold">
          Позвонить
        </a>
        <a href={siteConfig.social.whatsapp} className="rounded-xl bg-[var(--accent)] px-3 py-3 text-center font-semibold">
          Записаться
        </a>
      </div>
    </div>
  );
}
