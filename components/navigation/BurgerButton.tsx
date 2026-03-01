"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

export type BurgerButtonHandle = {
  animateOpen: () => void;
  animateClose: () => void;
};

type BurgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const BurgerButton = forwardRef<BurgerButtonHandle, BurgerButtonProps>(({ isOpen, onToggle }, ref) => {
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const top = topRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    if (!top || !mid || !bot) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(top, { y: 8, width: "100%", duration: 0.25, ease: "power2.in" }, 0);
    tl.to(bot, { y: -8, width: "100%", duration: 0.25, ease: "power2.in" }, 0);
    tl.to(mid, { scaleX: 0, opacity: 0, duration: 0.2, ease: "power2.in" }, 0);

    tl.to(top, { rotation: 45, duration: 0.35, ease: "back.out(1.6)" }, 0.25);
    tl.to(bot, { rotation: -45, duration: 0.35, ease: "back.out(1.6)" }, 0.25);

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) tl.timeScale(1).play();
    else tl.timeScale(1.3).reverse();
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    animateOpen: () => tlRef.current?.play(),
    animateClose: () => tlRef.current?.reverse(),
  }));

  const handleMouseEnter = useCallback(() => {
    if (isOpen) return;
    gsap.to(midRef.current, { width: "100%", duration: 0.3, ease: "power2.out" });
    gsap.to(botRef.current, { width: "100%", duration: 0.3, ease: "power2.out", delay: 0.05 });
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (isOpen) return;
    gsap.to(midRef.current, { width: "60%", duration: 0.4, ease: "power2.out" });
    gsap.to(botRef.current, { width: "36%", duration: 0.4, ease: "power2.out", delay: 0.05 });
  }, [isOpen]);

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className={cn(
        "relative z-[200] flex h-12 w-12 items-center justify-center",
        "cursor-pointer select-none rounded-none border-none bg-transparent outline-none",
        "active:scale-90 transition-transform duration-200",
        "focus-visible:outline-none",
      )}
    >
      <div className="relative flex h-[18px] w-7 flex-col items-start justify-between">
        <span ref={topRef} className="block h-[2.5px] w-full origin-center rounded-full bg-white will-change-transform" />
        <span
          ref={midRef}
          className="block h-[2.5px] origin-left rounded-full bg-white/60 will-change-transform"
          style={{ width: "60%" }}
        />
        <span
          ref={botRef}
          className="block h-[2.5px] origin-center rounded-full bg-white/35 will-change-transform"
          style={{ width: "36%" }}
        />
      </div>
    </button>
  );
});

BurgerButton.displayName = "BurgerButton";
