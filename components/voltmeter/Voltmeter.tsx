"use client";

import type { FC } from "react";
import { cn } from "@/lib/cn";
import type { VoltmeterProps } from "./voltmeter.types";
import { SIZE_CONFIG } from "./voltmeter.constants";
import { useVoltmeter } from "./useVoltmeter";
import { VoltmeterMiniChart } from "./VoltmeterMiniChart";
import { VoltmeterParticles } from "./VoltmeterParticles";
import { VoltmeterRing } from "./VoltmeterRing";
import { VoltmeterValue } from "./VoltmeterValue";

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Voltmeter: FC<VoltmeterProps> = ({
  voltage,
  autoAnimate = true,
  animationInterval = 2500,
  size = "lg",
  label = "Бортовое напряжение",
  showChart = true,
  className,
  onVoltageChange,
}) => {
  const { state, valueRef, ringRef, glowRingRef, wrapRef } = useVoltmeter({
    voltage,
    autoAnimate,
    animationInterval,
    onVoltageChange,
  });

  const cfg = SIZE_CONFIG[size];
  const zone = state.zone;

  return (
    <div ref={wrapRef} className={cn("relative flex select-none flex-col items-center", className)} style={{ width: cfg.container }}>
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.04), 0 40px 80px -20px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="pointer-events-none absolute -inset-1/2"
          style={{
            background: `radial-gradient(300px circle at 50% 30%, ${hexToRgba(zone.color, 0.08)} 0%, transparent 70%)`,
            transition: "background 1s ease",
          }}
          aria-hidden
        />

        <VoltmeterParticles color={zone.color} count={20} />

        <div
          className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${hexToRgba(zone.color, 0.6)}, transparent)`,
            transition: "background 0.8s ease",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col items-center px-6 pb-5 pt-5">
          <div className="mb-3 flex w-full items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">{label}</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: zone.color, boxShadow: `0 0 4px ${zone.color}` }} />
              <span className="text-[9px] font-medium tracking-wider text-white/20">LIVE</span>
            </div>
          </div>

          <div className="relative" style={{ width: cfg.ring * 2, height: cfg.ring * 2 }}>
            <VoltmeterRing voltage={state.voltage} zone={zone} ringRef={ringRef} glowRingRef={glowRingRef} />
            <div className="absolute inset-0 flex items-center justify-center">
              <VoltmeterValue ref={valueRef} voltage={state.voltage} zone={zone} trend={state.trend} delta={state.delta} />
            </div>
          </div>

          <div
            className="mt-2 flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: hexToRgba(zone.color, 0.08),
              border: `1px solid ${hexToRgba(zone.color, 0.2)}`,
              transition: "all 0.6s ease",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: zone.color, boxShadow: `0 0 6px ${hexToRgba(zone.color, 0.8)}` }} />
            <span className="text-[11px] font-semibold tracking-[0.15em]" style={{ color: zone.color, textShadow: `0 0 10px ${hexToRgba(zone.color, 0.3)}` }}>
              {zone.label}
            </span>
          </div>

          {showChart && state.history.length >= 2 ? (
            <div className="mt-4 w-full">
              <VoltmeterMiniChart history={state.history} zone={zone} />
            </div>
          ) : null}
        </div>

        <div
          className="absolute bottom-0 left-1/2 h-px w-16 -translate-x-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${hexToRgba(zone.color, 0.3)}, transparent)`,
            transition: "background 0.8s ease",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
};

export default Voltmeter;
