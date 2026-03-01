"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { runRevealAnimation } from "@/lib/gsapPresets";
import { cn } from "@/lib/cn";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

export function Reveal({ children, className }: RevealProps) {
  const [ref, inView] = useInView({ threshold: 0.16, once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduced) return;
    const tween = runRevealAnimation(node);
    return () => {
      tween.kill();
    };
  }, [inView, reduced, ref]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        !reduced && !inView ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
