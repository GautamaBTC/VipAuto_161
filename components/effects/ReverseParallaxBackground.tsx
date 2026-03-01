"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ReverseParallaxBackgroundProps = {
  speed?: number; // positive value means upward shift on scroll down
};

export function ReverseParallaxBackground({
  speed = 0.16,
}: ReverseParallaxBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to(layer, {
      yPercent: -Math.abs(speed) * 28,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, speed]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={layerRef}
        className="absolute inset-[-12%]"
        style={{
          background:
            "radial-gradient(600px 240px at 15% 20%, rgba(255,95,46,0.14), transparent 72%), radial-gradient(700px 300px at 85% 10%, rgba(215,23,23,0.16), transparent 74%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
