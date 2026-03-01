"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComparisonItemProps = {
  icon: ReactNode;
  text: string;
  variant: "negative" | "positive";
};

export function ComparisonItem({ icon, text, variant }: ComparisonItemProps) {
  const isPositive = variant === "positive";

  return (
    <div className={cn("group/item flex items-start gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-white/[0.03]")}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-400 group-hover/item:scale-110",
          isPositive ? "bg-[var(--accent)]/15 text-[var(--accent-2)]" : "bg-red-500/10 text-red-300/80",
        )}
      >
        {icon}
      </div>
      <p className={cn("pt-1.5 text-[15px] leading-relaxed", isPositive ? "text-white/82" : "text-white/45")}>{text}</p>
    </div>
  );
}
