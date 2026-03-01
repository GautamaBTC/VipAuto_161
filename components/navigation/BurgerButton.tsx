"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

export function BurgerButton({ isOpen, onToggle, className }: BurgerButtonProps) {
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const top = topRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    if (!top || !mid || !bot) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.4, ease: "power2.inOut" },
    });

    tl.to(mid, { scaleX: 0, autoAlpha: 0, duration: 0.2 }, 0)
      .to(top, { top: "50%", yPercent: -50, duration: 0.3 }, 0)
      .to(bot, { top: "50%", yPercent: -50, duration: 0.3 }, 0)
      .to(
        top,
        {
          rotation: 45,
          width: "32px",
          backgroundColor: "#ffffff",
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        0.2,
      )
      .to(
        bot,
        {
          rotation: -45,
          width: "18px",
          x: -4,
          backgroundColor: "#ffffff",
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        0.2,
      );

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (isOpen) return;
    gsap.to(topRef.current, { width: "100%", duration: 0.3, ease: "power2.out" });
    gsap.to(midRef.current, { width: "100%", x: 0, duration: 0.3, delay: 0.05, ease: "power2.out" });
    gsap.to(botRef.current, { width: "100%", duration: 0.3, delay: 0.1, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (isOpen) return;
    gsap.to(topRef.current, { width: "24px", duration: 0.3, ease: "power2.out" });
    gsap.to(midRef.current, { width: "32px", duration: 0.3, ease: "power2.out" });
    gsap.to(botRef.current, { width: "18px", duration: 0.3, ease: "power2.out" });
  };

  return (
    <button
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative z-[10001] flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/5",
        className,
      )}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
    >
      <div className="relative h-[24px] w-[32px]">
        <span
          ref={topRef}
          className="absolute right-0 top-0 block h-[2px] w-[24px] rounded-full bg-white will-change-transform"
        />
        <span
          ref={midRef}
          className="absolute right-0 top-[11px] block h-[2px] w-[32px] rounded-full bg-white will-change-transform"
        />
        <span
          ref={botRef}
          className="absolute bottom-0 right-0 block h-[2px] w-[18px] rounded-full bg-white will-change-transform"
        />
      </div>
    </button>
  );
}
