"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useEntrance(reducedMotion: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasPlayed.current) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-meter-channel]");
    const header = el.querySelector<HTMLElement>("[data-meter-header]");
    const footer = el.querySelector<HTMLElement>("[data-meter-footer]");
    const border = el.querySelector<HTMLElement>("[data-meter-border]");

    if (reducedMotion) {
      const all = [header, footer, border, ...Array.from(cards)].filter(Boolean) as HTMLElement[];
      gsap.set(all, { opacity: 1, y: 0, scale: 1 });
      hasPlayed.current = true;
      return;
    }

    gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });
    if (header) gsap.set(header, { opacity: 0, y: 20 });
    if (footer) gsap.set(footer, { opacity: 0, y: 20 });
    if (border) gsap.set(border, { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        hasPlayed.current = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (border) tl.to(border, { opacity: 1, duration: 0.8 }, 0);
        if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
        tl.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12 }, 0.2);
        if (footer) tl.to(footer, { opacity: 1, y: 0, duration: 0.6 }, 0.5);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  return containerRef;
}
