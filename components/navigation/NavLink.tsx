"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  index: number;
  accentColorClass?: string;
  onClick?: () => void;
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, label, icon, index, accentColorClass = "text-[var(--accent)]", onClick }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        data-nav-item
        className={cn(
          "group/link relative flex items-center gap-5 rounded-2xl px-6 py-5 transition-all duration-400 hover:bg-white/[0.03]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50",
        )}
      >
        <span className="font-mono text-xs tabular-nums tracking-wider text-white/20 transition-colors duration-400 group-hover/link:text-white/40">
          {String(index + 1).padStart(2, "0")}
        </span>

        {icon ? (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] transition-all duration-400 group-hover/link:scale-110 group-hover/link:-rotate-3",
              accentColorClass,
            )}
          >
            {icon}
          </div>
        ) : null}

        <span className="text-2xl font-bold tracking-tight text-white/80 transition-all duration-400 group-hover/link:translate-x-2 group-hover/link:text-white sm:text-3xl">
          {label}
        </span>

        <svg
          className="ml-auto h-5 w-5 -translate-x-2 text-white/0 transition-all duration-400 group-hover/link:translate-x-0 group-hover/link:text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>

        <span className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04]" />
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";
