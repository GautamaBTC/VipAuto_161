"use client";

import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  colors: [string, string, string];
  reducedMotion: boolean;
};

export const MeterBorderGlow = memo(function MeterBorderGlow({ colors, reducedMotion }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const angle = useRef({ v: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.background = `linear-gradient(90deg, ${colors[0]}22, ${colors[1]}22, ${colors[2]}22)`;
      return;
    }

    const tween = gsap.to(angle.current, {
      v: 360,
      duration: 8,
      repeat: -1,
      ease: "none",
      onUpdate() {
        el.style.background = `conic-gradient(from ${angle.current.v}deg, transparent 0%, ${colors[0]}22 15%, transparent 30%, ${colors[1]}22 50%, transparent 65%, ${colors[2]}22 80%, transparent 100%)`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [colors, reducedMotion]);

  return (
    <>
      <div ref={ref} data-meter-border className="absolute -inset-px rounded-[21px] sm:rounded-[29px]" style={{ opacity: 0.8 }} aria-hidden />
      <div className="absolute inset-px rounded-[20px] sm:rounded-[28px]" style={{ background: "#06060a" }} aria-hidden />
    </>
  );
});
