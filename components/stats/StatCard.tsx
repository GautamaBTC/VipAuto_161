"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { useCountUp } from "@/components/stats/useCountUp";

const accentMap = {
  purple: {
    iconBg: "bg-[#6c5ce71f]",
    suffixColor: "text-[#8f81ff]",
    lineClass: "from-transparent via-[#6c5ce7] to-transparent",
    glowClass: "bg-[#6c5ce733]",
  },
  teal: {
    iconBg: "bg-[#00cec91f]",
    suffixColor: "text-[#5de9e4]",
    lineClass: "from-transparent via-[#00cec9] to-transparent",
    glowClass: "bg-[#00cec933]",
  },
  pink: {
    iconBg: "bg-[#fd79a81f]",
    suffixColor: "text-[#ff9dc0]",
    lineClass: "from-transparent via-[#fd79a8] to-transparent",
    glowClass: "bg-[#fd79a833]",
  },
  gold: {
    iconBg: "bg-[#fdcb6e1f]",
    suffixColor: "text-[#ffd68d]",
    lineClass: "from-transparent via-[#fdcb6e] to-transparent",
    glowClass: "bg-[#fdcb6e33]",
  },
} as const;

export type AccentKey = keyof typeof accentMap;

type StatCardProps = {
  icon: ReactNode;
  target: number;
  suffix?: string;
  decimals?: number;
  label: string;
  accent: AccentKey;
  index: number;
};

export function StatCard({
  icon,
  target,
  suffix = "",
  decimals = 0,
  label,
  accent,
  index,
}: StatCardProps) {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: valueRef, start, stop, setImmediate } = useCountUp({
    target,
    decimals,
    duration: 2,
  });

  const a = accentMap[accent];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      setImmediate(target);
      return;
    }

    const hoverTl = gsap.timeline({ paused: true }).to(el, {
      y: -4,
      duration: 0.4,
      ease: "power3.out",
    });

    const enter = () => hoverTl.play();
    const leave = () => hoverTl.reverse();
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    gsap.set(el, { autoAlpha: 0, y: 40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "expo.out",
          onComplete: () => {
            valueRef.current?.classList.add("shimmer-text");
            start();
            window.setTimeout(() => {
              valueRef.current?.classList.remove("shimmer-text");
            }, 2100);
          },
        });
      },
    });

    return () => {
      stop();
      trigger.kill();
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      hoverTl.kill();
    };
  }, [gsap, index, reduced, setImmediate, start, stop, target, valueRef]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "glass-card group/card p-8 sm:p-9",
        "max-sm:grid max-sm:grid-cols-[auto_1fr] max-sm:gap-x-5 max-sm:rounded-2xl max-sm:p-6",
      )}
    >
      <div className={cn("glow-line bg-gradient-to-r", a.lineClass)} />
      <div className={cn("corner-glow", a.glowClass)} />

      <div
        className={cn(
          "mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] text-xl transition-transform duration-400 group-hover/card:scale-110",
          "max-sm:row-span-2 max-sm:mb-0 max-sm:h-12 max-sm:w-12",
          a.iconBg,
        )}
      >
        {icon}
      </div>

      <div className="mb-2 flex items-baseline gap-0.5 max-sm:mb-0.5">
        <span
          ref={valueRef}
          className="font-mono text-[clamp(36px,4vw,52px)] font-extrabold leading-none tracking-tight text-gray-100 tabular-nums max-sm:text-[32px]"
        >
          0
        </span>
        {suffix ? (
          <span className={cn("text-[clamp(20px,2.5vw,28px)] font-bold leading-none max-sm:text-lg", a.suffixColor)}>
            {suffix}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed tracking-wide text-white/55 max-sm:text-[13px]">{label}</p>
    </article>
  );
}
