"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

type FullscreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function FullscreenMenu({ isOpen, onClose, children }: FullscreenMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const nav = navRef.current;
    const footer = footerRef.current;
    if (!overlay || !panel || !nav || !footer) return;

    const navItems = nav.querySelectorAll("[data-nav-item]");
    const footerEls = footer.querySelectorAll("[data-footer-el]");

    gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(panel, { xPercent: 105 });
    gsap.set(navItems, { autoAlpha: 0, x: 80, skewX: -6 });
    gsap.set(footerEls, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
      onReverseComplete: () => {
        gsap.set(overlay, { pointerEvents: "none" });
      },
    });

    tl.to(overlay, {
      autoAlpha: 1,
      pointerEvents: "auto",
      duration: 0.4,
      ease: "power2.out",
    });

    tl.to(
      panel,
      {
        xPercent: 0,
        duration: 0.9,
        ease: "expo.out",
      },
      0.05,
    );

    tl.to(
      navItems,
      {
        autoAlpha: 1,
        x: 0,
        skewX: 0,
        duration: 0.7,
        stagger: 0.055,
        ease: "expo.out",
      },
      0.3,
    );

    tl.to(
      footerEls,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "expo.out",
      },
      0.55,
    );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.timeScale(1.6).reverse();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[500]" style={{ visibility: "hidden", opacity: 0 }}>
      <div className="absolute inset-0 bg-black/82 backdrop-blur-xl" onClick={onClose} aria-hidden="true" />

      <aside
        ref={panelRef}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full flex-col",
          "bg-[linear-gradient(180deg,#06060d_0%,#080913_45%,#090b16_100%)] sm:w-[440px] sm:border-l sm:border-white/12 sm:backdrop-blur-2xl",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-32 h-[300px] w-[300px] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-[var(--accent-2)]/8 blur-[100px]" />

        <div className="flex items-center justify-between px-6 pb-6 pt-20 sm:pt-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/20">Навигация</p>
            <div className="mt-2 h-px w-8 bg-gradient-to-r from-[var(--accent)] to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-medium tracking-wider text-white/30 transition-colors duration-300 hover:text-white/60"
          >
            закрыть
            <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px]">esc</kbd>
          </button>
        </div>

        <nav ref={navRef} className="menu-scroll flex-1 overflow-y-auto px-4 sm:px-5" role="navigation">
          <div className="flex flex-col">{children}</div>
        </nav>

        <div ref={footerRef} className="mt-auto border-t border-white/10 px-6 pb-8 pt-6">
          <a
            href={`tel:${siteConfig.phones[0]?.replace(/[^\d+]/g, "")}`}
            data-footer-el
            className="group/f mb-3 flex items-center gap-3 text-sm text-white/45 transition-colors duration-300 hover:text-[#00b894]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00b894]/12 text-[#00b894] transition-transform duration-300 group-hover/f:scale-110">
              <Phone className="h-4 w-4" />
            </div>
            {siteConfig.phones[0]}
          </a>

          <div data-footer-el className="mb-3 flex items-center gap-3 text-sm text-white/35">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/65">
              <MapPin className="h-4 w-4" />
            </div>
            {siteConfig.address}
          </div>

          <div data-footer-el className="mb-6 flex items-center gap-3 text-sm text-white/35">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/65">
              <Clock className="h-4 w-4" />
            </div>
            {siteConfig.schedule}
          </div>

          <a
            href={siteConfig.social.whatsapp}
            onClick={onClose}
            data-footer-el
            className="group/cta flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00b894] px-6 py-4 text-sm font-bold text-[var(--bg-primary)] transition-all duration-300 hover:bg-[#00b894]/90 hover:shadow-[0_0_40px_rgba(0,184,148,0.2)] active:scale-[0.97]"
          >
            Записаться на диагностику
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
