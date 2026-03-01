"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const BurgerButton = forwardRef<HTMLButtonElement, BurgerButtonProps>(({ isOpen, onToggle }, ref) => {
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const top = topRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    if (!top || !mid || !bot) return;

    gsap.set([top, mid, bot], { clearProps: "all" });
    gsap.set(top, { x: 0, y: 0, opacity: 1, scale: 1, width: "100%" });
    gsap.set(mid, { x: 0, y: 0, opacity: 1, scale: 1, width: "75%" });
    gsap.set(bot, { x: 0, y: 0, opacity: 1, scale: 1, width: "50%" });

    const tl = gsap.timeline({ paused: true });
    tl.to(top, { x: 18, y: -8, opacity: 0, scale: 0.7, duration: 0.28, ease: "power3.in" }, 0);
    tl.to(mid, { x: -24, opacity: 0, scale: 0.5, duration: 0.22, ease: "power3.in" }, 0);
    tl.to(bot, { x: 22, y: 8, opacity: 0, scale: 0.7, duration: 0.28, ease: "power3.in" }, 0);

    openTlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = openTlRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.2).reverse();
    }
  }, [isOpen]);

  const handleMouseEnter = useCallback(() => {
    if (isOpen) return;
    gsap.to(topRef.current, { width: "70%", duration: 0.24, ease: "power2.out" });
    gsap.to(midRef.current, { width: "100%", duration: 0.24, ease: "power2.out" });
    gsap.to(botRef.current, { width: "85%", duration: 0.24, ease: "power2.out" });
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (isOpen) return;
    gsap.to(topRef.current, { width: "100%", duration: 0.3, ease: "power2.out" });
    gsap.to(midRef.current, { width: "75%", duration: 0.3, ease: "power2.out" });
    gsap.to(botRef.current, { width: "50%", duration: 0.3, ease: "power2.out" });
  }, [isOpen]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
      className={cn(
        "relative z-[10001] flex h-12 w-12 items-center justify-center",
        "cursor-pointer select-none rounded-none border-none bg-transparent outline-none",
        "active:scale-90 transition-transform duration-200",
        "focus-visible:outline-none",
      )}
    >
      <div className="relative flex h-[18px] w-7 flex-col items-end justify-between">
        <span ref={topRef} className="block h-[2.5px] w-full origin-center rounded-full bg-white will-change-transform" />
        <span
          ref={midRef}
          className="block h-[2.5px] origin-right rounded-full bg-white/70 will-change-transform"
          style={{ width: "75%" }}
        />
        <span
          ref={botRef}
          className="block h-[2.5px] origin-right rounded-full bg-white/45 will-change-transform"
          style={{ width: "50%" }}
        />
      </div>
    </button>
  );
});

BurgerButton.displayName = "BurgerButton";
