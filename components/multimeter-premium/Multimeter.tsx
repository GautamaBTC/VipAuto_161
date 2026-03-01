"use client";

import type { FC } from "react";

import type { MultimeterProps } from "./multimeter.types";
import { CHANNELS } from "./multimeter.constants";
import { useMultimeter } from "./useMultimeter";
import { MeterChannel } from "./MeterChannel";

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MultimeterPremium: FC<MultimeterProps> = ({
  voltage,
  current,
  resistance,
  autoAnimate = true,
  animationInterval = 2800,
  className,
}) => {
  const { states, setRef } = useMultimeter({ voltage, current, resistance, autoAnimate, animationInterval });

  const channels = [
    { config: CHANNELS.voltage, state: states.voltage },
    { config: CHANNELS.current, state: states.current },
    { config: CHANNELS.resistance, state: states.resistance },
  ] as const;

  return (
    <section className={`relative w-full overflow-hidden select-none ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[20px] sm:rounded-[28px]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow:
              "0 0 0 0.5px rgba(255,255,255,0.03), 0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <div className="h-px w-40 sm:w-60" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          </div>

          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute -left-1/4 -top-1/2 h-full w-1/2 opacity-[0.03]"
              style={{ background: `radial-gradient(circle, ${withAlpha(states.voltage.zone.color, 1)} 0%, transparent 70%)`, transition: "background 1s ease" }}
            />
            <div
              className="absolute -top-1/4 left-1/4 h-full w-1/2 opacity-[0.03]"
              style={{ background: `radial-gradient(circle, ${withAlpha(states.current.zone.color, 1)} 0%, transparent 70%)`, transition: "background 1s ease" }}
            />
            <div
              className="absolute -right-1/4 -top-1/2 h-full w-1/2 opacity-[0.03]"
              style={{ background: `radial-gradient(circle, ${withAlpha(states.resistance.zone.color, 1)} 0%, transparent 70%)`, transition: "background 1s ease" }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-5 sm:px-8 sm:pt-7">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sm:h-[18px] sm:w-[18px]">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  <rect x="5" y="3.5" width="6" height="4" rx="1" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  <circle cx="6.5" cy="11" r="1" fill="rgba(255,255,255,0.15)" />
                  <circle cx="9.5" cy="11" r="1" fill="rgba(255,255,255,0.15)" />
                  <line x1="4" y1="13.5" x2="6" y2="13.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                  <line x1="10" y1="13.5" x2="12" y2="13.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-[0.1em] text-white/40 sm:text-xs">МУЛЬТИМЕТР</span>
                <span className="text-[9px] tracking-wider text-white/15">АВТОЭЛЕКТРИК | ДИАГНОСТИКА</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-white/30">LIVE</span>
            </div>
          </div>

          <div className="relative z-10 mx-5 mt-4 sm:mx-8">
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 p-5 sm:grid-cols-3 sm:gap-4 sm:p-8 md:gap-8">
            {channels.map(({ config, state }) => (
              <MeterChannel key={config.mode} config={config} state={state} setRef={setRef} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-0 hidden sm:block" aria-hidden>
            <div className="absolute bottom-10 top-[120px]" style={{ left: "33.333%", width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent)" }} />
            <div className="absolute bottom-10 top-[120px]" style={{ left: "66.666%", width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent)" }} />
          </div>

          <div className="relative z-10 mx-5 mb-5 sm:mx-8 sm:mb-7">
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/30 ring-1 ring-red-500/10" />
                  <span className="text-[9px] text-white/15">V/?</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-black ring-1 ring-white/10" />
                  <span className="text-[9px] text-white/15">COM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/30 ring-1 ring-yellow-500/10" />
                  <span className="text-[9px] text-white/15">A</span>
                </div>
              </div>

              <span className="font-mono text-[9px] text-white/10">AE-DMM-2024</span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="h-px w-32" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultimeterPremium;

