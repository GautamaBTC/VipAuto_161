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
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const footer = footerRef.current;
    if (!overlay || !content || !footer) return;

    const navItems = content.querySelectorAll("[data-nav-item]");
    const footerEls = Array.from(footer.children);
    gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
      onReverseComplete: () => {
        gsap.set(overlay, { pointerEvents: "none" });
      },
    });

    tl.to(overlay, { autoAlpha: 1, pointerEvents: "auto", duration: 0.5 });
    tl.fromTo(content, { xPercent: 100, skewX: -3 }, { xPercent: 0, skewX: 0, duration: 0.8 }, 0.1);
    tl.fromTo(
      navItems,
      { autoAlpha: 0, x: 60, skewX: -4 },
      { autoAlpha: 1, x: 0, skewX: 0, duration: 0.7, stagger: 0.06 },
      0.35,
    );
    tl.fromTo(footerEls, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.6);

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      tl.timeScale(1).play();
    } else {
      document.body.style.overflow = "";
      tl.timeScale(1.5).reverse();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <aside
        ref={contentRef}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full flex-col border-l border-white/10 bg-[rgba(10,10,20,0.9)] backdrop-blur-2xl sm:w-[480px] lg:w-[520px]",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div aria-hidden className="pointer-events-none absolute -top-20 right-10 h-[200px] w-[300px] rounded-full bg-[var(--accent)]/15 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-20 left-10 h-[180px] w-[250px] rounded-full bg-[var(--accent-2)]/10 blur-[80px]" />

        <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/20">Навигация</span>
          <button onClick={onClose} className="text-xs text-white/35 transition-colors hover:text-white/65">
            ESC
          </button>
        </div>

        <nav className="menu-scroll flex-1 overflow-y-auto px-4 sm:px-6" role="navigation">
          <div className="flex flex-col gap-1 py-4">{children}</div>
        </nav>

        <div ref={footerRef} className="border-t border-white/10 px-6 py-6 sm:px-8">
          <a
            href={`tel:${siteConfig.phones[0]?.replace(/[^\d+]/g, "")}`}
            className="group/f mb-4 flex items-center gap-3 text-sm text-white/45 transition-colors hover:text-[var(--accent-2)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/12 text-[var(--accent)] transition-transform duration-300 group-hover/f:scale-110">
              <Phone className="h-3.5 w-3.5" />
            </div>
            {siteConfig.phones[0]}
          </a>

          <div className="mb-4 flex items-center gap-3 text-sm text-white/35">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/65">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            {siteConfig.address}
          </div>

          <div className="mb-6 flex items-center gap-3 text-sm text-white/35">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/65">
              <Clock className="h-3.5 w-3.5" />
            </div>
            {siteConfig.schedule}
          </div>

          <a
            href={siteConfig.social.whatsapp}
            onClick={onClose}
            className="group/cta flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent)]/16 px-6 py-3.5 text-sm font-semibold text-[var(--accent-2)] transition-all duration-400 hover:border-[var(--accent)]/45 hover:bg-[var(--accent)]/24 hover:shadow-[0_0_30px_rgba(215,23,23,0.18)] active:scale-[0.97]"
          >
            Записаться на диагностику
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
