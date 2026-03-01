"use client";

import { useCallback, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";

export function ScrollProgress() {
  const gsap = useGSAP();
  const barRef = useRef<HTMLDivElement>(null);

  const createTrigger = useCallback((): ScrollTrigger | null => {
    const node = barRef.current;
    if (!node) return null;

    gsap.set(node, { scaleX: 0, transformOrigin: "left center" });

    return ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(node, { scaleX: self.progress });
      },
    });
  }, [gsap]);

  useScrollTrigger({ create: createTrigger });

  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent">
      <div ref={barRef} className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
    </div>
  );
}
