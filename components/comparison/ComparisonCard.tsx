"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComparisonCardProps = {
  variant: "garage" | "vip";
  badge: string;
  title: string;
  titleIcon: ReactNode;
  children: ReactNode;
};

export const ComparisonCard = forwardRef<HTMLDivElement, ComparisonCardProps>(
  ({ variant, badge, title, titleIcon, children }, ref) => {
    const isVip = variant === "vip";

    return (
      <article
        ref={ref}
        className={cn(
          "comparison-card group flex flex-col p-6 sm:p-8 lg:p-10",
          isVip ? "comparison-card--vip" : "comparison-card--garage",
        )}
      >
        {isVip ? <div className="comparison-vip-line" /> : null}
        {isVip ? <div aria-hidden className="comparison-vip-corner" /> : null}

        <div
          className={cn(
            "mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider",
            isVip
              ? "border border-[var(--accent)]/35 bg-[var(--accent)]/15 text-[var(--accent-2)]"
              : "border border-white/10 bg-white/[0.04] text-white/45",
          )}
        >
          {isVip ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" /> : null}
          {badge}
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl",
              isVip ? "bg-[var(--accent)]/15 text-[var(--accent-2)]" : "bg-white/[0.04] text-white/25",
            )}
          >
            {titleIcon}
          </div>
          <h3 className={cn("text-xl font-bold tracking-tight sm:text-2xl", isVip ? "text-white" : "text-white/55")}>
            {title}
          </h3>
        </div>

        <div className="flex flex-col gap-1">{children}</div>

        {!isVip ? <div aria-hidden className="comparison-garage-dashed" /> : null}
      </article>
    );
  },
);

ComparisonCard.displayName = "ComparisonCard";
