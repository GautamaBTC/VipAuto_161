"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const BurgerButton = forwardRef<HTMLButtonElement, BurgerButtonProps>(
  ({ isOpen, onToggle }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        className={cn(
          "group relative z-[200] flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-xl transition-all duration-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 active:scale-90",
          isOpen
            ? "border-white/15 bg-white/10"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 shadow-[0_0_20px_rgba(215,23,23,0.2)]",
            "group-hover:opacity-100",
            isOpen ? "!opacity-0" : "",
          )}
        />

        <div className="relative flex h-5 w-6 flex-col justify-between">
          <span
            className={cn(
              "block h-[2px] origin-center rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              isOpen
                ? "w-full translate-y-[9px] rotate-45 bg-[var(--accent)]"
                : "w-full bg-white/75 group-hover:w-5 group-hover:bg-white",
            )}
          />
          <span
            className={cn(
              "block h-[2px] origin-center rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              isOpen
                ? "w-full scale-x-0 opacity-0 bg-white"
                : "w-4 bg-white/55 group-hover:w-6 group-hover:bg-white/80",
            )}
          />
          <span
            className={cn(
              "block h-[2px] origin-center rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              isOpen
                ? "w-full -translate-y-[9px] -rotate-45 bg-[var(--accent-2)]"
                : "w-3 bg-white/35 group-hover:w-4 group-hover:bg-white/65",
            )}
          />
        </div>
      </button>
    );
  },
);

BurgerButton.displayName = "BurgerButton";
