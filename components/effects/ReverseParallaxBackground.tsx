"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ReverseParallaxBackgroundProps = {
  speed?: number;
  maxOffset?: number;
};

export function ReverseParallaxBackground({
  speed = 0.12,
  maxOffset = 90,
}: ReverseParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let raf = 0;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const offset = Math.max(0, Math.min(maxOffset, -rect.top * speed));
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [maxOffset, reduced, speed]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
      <div
        className="absolute inset-[-12%]"
        style={{
          background:
            "radial-gradient(600px 240px at 15% 20%, rgba(255,95,46,0.14), transparent 72%), radial-gradient(700px 300px at 85% 10%, rgba(215,23,23,0.16), transparent 74%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
