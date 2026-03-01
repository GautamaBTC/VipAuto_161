"use client";

import { useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  index: number;
  direction?: "left" | "right";
  accentColor?: "purple" | "teal" | "green" | "pink" | "gold";
  onClick?: () => void;
};

export function NavLink({ href, label, icon, index, direction = "left", accentColor = "purple", onClick }: NavLinkProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    gsap.to(iconRef.current, {
      scale: 1.15,
      rotation: -6,
      duration: 0.4,
      ease: "back.out(2)",
    });
    gsap.to(arrowRef.current, {
      x: 0,
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: "expo.out",
    });
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, {
      x: -12,
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }, []);

  void index;
  void accentColor;

  return (
    <Link
      href={href}
      onClick={onClick}
      data-nav-item
      data-menu-direction={direction}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "relative flex items-center gap-4 rounded-2xl px-3 py-5 sm:gap-5 sm:px-4 sm:py-6",
        "transition-colors duration-300 hover:bg-white/[0.04]",
        "focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/40",
      )}
    >
      {icon ? (
        <div
          ref={iconRef}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl will-change-transform",
            "bg-[var(--accent)]/15 text-[var(--accent)]",
          )}
        >
          {icon}
        </div>
      ) : null}

      <span className="flex-1 text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">{label}</span>

      <div ref={arrowRef} className="shrink-0 text-white/35 will-change-transform" style={{ opacity: 0, transform: "translateX(-12px)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      <span ref={lineRef} className="absolute bottom-0 left-4 right-4 h-px origin-left bg-[var(--accent)]/35" style={{ transform: "scaleX(0)" }} />
      <span className="absolute bottom-0 left-4 right-4 h-px bg-white/[0.04]" />
    </Link>
  );
}
