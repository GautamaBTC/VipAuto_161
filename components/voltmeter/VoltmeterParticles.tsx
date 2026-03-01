"use client";

import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  color: string;
  count?: number;
};

export const VoltmeterParticles = memo(function VoltmeterParticles({ color, count = 24 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";
    const dots: HTMLSpanElement[] = [];

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement("span");
      dot.className = "absolute rounded-full";
      const size = 1 + Math.random() * 2;
      Object.assign(dot.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: "0",
      });
      el.appendChild(dot);
      dots.push(dot);
    }

    dots.forEach((dot, i) => {
      gsap.to(dot, {
        opacity: () => 0.15 + Math.random() * 0.35,
        y: () => -20 - Math.random() * 40,
        x: () => (Math.random() - 0.5) * 30,
        duration: () => 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        delay: i * 0.15,
        ease: "sine.inOut",
      });
    });

    return () => {
      gsap.killTweensOf(dots);
    };
  }, [count]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    Array.from(el.children).forEach((child) => {
      (child as HTMLElement).style.backgroundColor = color;
    });
  }, [color]);

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />;
});
