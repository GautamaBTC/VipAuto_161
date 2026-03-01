"use client";

import type { FC } from "react";
import { cn } from "@/lib/cn";

import type { MultimeterProps } from "./multimeter.types";
import { CHANNELS } from "./multimeter.constants";
import { useMultimeter } from "./useMultimeter";
import { useEntrance } from "./useEntrance";
import { useReducedMotion } from "./useReducedMotion";
import { MeterChannel } from "./MeterChannel";
import { MeterNoise } from "./MeterNoise";
import { MeterBorderGlow } from "./MeterBorderGlow";

export const Multimeter: FC<MultimeterProps> = ({
  voltage,
  current,
  resistance,
  autoAnimate = true,
  animationInterval = 2800,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useEntrance(reducedMotion);

  const { states, setRef } = useMultimeter({
    voltage,
    current,
    resistance,
    autoAnimate,
    animationInterval,
    reducedMotion,
  });

  const borderColors: [string, string, string] = [states.voltage.zone.color, states.current.zone.color, states.resistance.zone.color];

  const channels = [
    { config: CHANNELS.voltage, state: states.voltage },
    { config: CHANNELS.current, state: states.current },
    { config: CHANNELS.resistance, state: states.resistance },
  ] as const;

  return (
    <section ref={containerRef} className={cn("relative w-full select-none", className)} aria-label="Мультиметр - визуализация электрических параметров">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative">
          <MeterBorderGlow colors={borderColors} reducedMotion={reducedMotion} />

          <div
            className="relative overflow-hidden rounded-[20px] sm:rounded-[28px]"
            style={{
              background: "linear-gradient(180deg, rgba(12,12,18,0.97) 0%, rgba(8,8,12,0.99) 100%)",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
            }}
          >
            <MeterNoise />

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              {channels.map(({ config, state }, i) => (
                <div
                  key={config.mode}
                  className="absolute h-[300px] w-[300px] rounded-full opacity-[0.025]"
                  style={{
                    background: `radial-gradient(circle, ${state.zone.color}, transparent 70%)`,
                    left: `${15 + i * 30}%`,
                    top: "-10%",
                    transition: "background 1.5s ease",
                  }}
                />
              ))}
            </div>

            <div data-meter-header className="relative z-10 flex items-center justify-between px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl sm:h-9 sm:w-9" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sm:h-[18px] sm:w-[18px]" aria-hidden>
                    <rect x="2" y="1" width="12" height="14" rx="2.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    <rect x="4.5" y="3" width="7" height="4" rx="1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" />
                    <circle cx="6" cy="10.5" r="0.8" fill="rgba(255,255,255,0.12)" />
                    <circle cx="8" cy="10.5" r="0.8" fill="rgba(255,255,255,0.12)" />
                    <circle cx="10" cy="10.5" r="0.8" fill="rgba(255,255,255,0.12)" />
                    <line x1="4" y1="13" x2="6.5" y2="13" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                    <line x1="9.5" y1="13" x2="12" y2="13" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  </svg>
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-white/35 sm:text-xs">МУЛЬТИМЕТР</p>
                  <p className="text-[9px] tracking-[0.1em] text-white/12 sm:text-[10px]">АВТОЭЛЕКТРИК · ДИАГНОСТИКА</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[9px] font-medium tracking-[0.15em] text-white/25">LIVE</span>
              </div>
            </div>

            <div className="relative z-10 mx-5 mt-3 sm:mx-8">
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-2 p-4 sm:grid-cols-3 sm:gap-0 sm:p-6 lg:p-8">
              {channels.map(({ config, state }) => (
                <MeterChannel key={config.mode} config={config} state={state} setRef={setRef} reducedMotion={reducedMotion} />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 hidden sm:block" aria-hidden>
              {[33.333, 66.666].map((pct) => (
                <div
                  key={pct}
                  className="absolute bottom-16 top-28"
                  style={{
                    left: `${pct}%`,
                    width: 1,
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.04) 60%, transparent 100%)",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 mx-5 sm:mx-8">
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>

            <div data-meter-footer className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
              <div className="flex items-center gap-4">
                {[
                  { color: "#ef4444", opacity: 0.25, ring: "#ef4444", label: "V/Ω" },
                  { color: "#000000", opacity: 1, ring: "#ffffff", label: "COM" },
                  { color: "#eab308", opacity: 0.25, ring: "#eab308", label: "A" },
                ].map(({ color, opacity, ring, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: color,
                        opacity,
                        boxShadow: `0 0 0 1px ${ring}25`,
                      }}
                    />
                    <span className="text-[9px] font-medium text-white/12">{label}</span>
                  </div>
                ))}
              </div>

              <span className="font-mono text-[9px] text-white/[0.08]">AE-DMM PRO</span>
            </div>
          </div>

          {!reducedMotion ? (
            <div
              className="pointer-events-none mx-auto mt-1 hidden h-20 max-w-[95%] overflow-hidden rounded-b-3xl opacity-[0.03] sm:block"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)",
                maskImage: "linear-gradient(180deg, white, transparent)",
                WebkitMaskImage: "linear-gradient(180deg, white, transparent)",
              }}
              aria-hidden
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Multimeter;
