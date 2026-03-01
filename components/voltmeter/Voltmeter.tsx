"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { DEMO_VOLTAGES, SIZE_MAP } from "@/components/voltmeter/voltmeter.constants";
import { VoltmeterArcBar } from "@/components/voltmeter/VoltmeterArcBar";
import { VoltmeterSegmentDisplay } from "@/components/voltmeter/VoltmeterSegmentDisplay";
import { VoltmeterSparkline } from "@/components/voltmeter/VoltmeterSparkline";
import { VoltmeterStatusPanel } from "@/components/voltmeter/VoltmeterStatusPanel";
import type { VoltmeterProps } from "@/components/voltmeter/voltmeter.types";
import { useVoltmeter } from "@/components/voltmeter/useVoltmeter";

export function Voltmeter({
  voltage,
  autoAnimate = true,
  animationInterval = 2500,
  size = "md",
  label = "Бортовое напряжение",
  showSparkline = true,
  showStatusPanel = true,
  className,
  onVoltageChange,
}: VoltmeterProps) {
  const dim = SIZE_MAP[size];
  const tapIndexRef = useRef(0);

  const { state, containerRef, glowRef, animateTo } = useVoltmeter({
    voltage,
    autoAnimate,
    animationInterval,
    onVoltageChange,
  });

  const { zone } = state;

  const allowTapUpdate = !autoAnimate;
  const onTapUpdate = () => {
    if (!allowTapUpdate || voltage !== undefined) return;
    tapIndexRef.current = (tapIndexRef.current + 1) % DEMO_VOLTAGES.length;
    const next = DEMO_VOLTAGES[tapIndexRef.current];
    if (next !== undefined) animateTo(next);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative mx-auto w-full select-none", className)}
      style={{ maxWidth: dim.width }}
      onClick={onTapUpdate}
      role={allowTapUpdate && voltage === undefined ? "button" : undefined}
      tabIndex={allowTapUpdate && voltage === undefined ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onTapUpdate();
      }}
      aria-label={allowTapUpdate && voltage === undefined ? "Обновить значение вольтметра" : undefined}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10"
        style={{
          minHeight: dim.height,
          background: "linear-gradient(180deg, #0c0c14 0%, #08080e 50%, #0a0a12 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px -15px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${zone.bgGlow} 0%, transparent 70%)` }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.45) 2px, rgba(255,255,255,0.45) 4px)",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: zone.color, boxShadow: `0 0 8px ${zone.glowColor}` }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] leading-none" style={{ color: zone.color }}>
              {zone.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wider text-gray-500">LIVE</span>
          </div>
        </div>

        <div className="relative z-10 px-4 pb-1 pt-3">
          <div className="relative mx-auto" style={{ maxWidth: 280 }}>
            <VoltmeterArcBar voltage={state.displayVoltage} zone={zone} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-[58%]">
                <VoltmeterSegmentDisplay voltage={state.displayVoltage} zone={zone} />
              </div>
              <span className="mt-0.5 font-mono text-[11px] font-bold tracking-[0.25em]" style={{ color: zone.color, opacity: 0.68 }}>
                VOLTS
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-4 mb-3 flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: `${zone.color}55`, backgroundColor: `${zone.color}12` }}>
          <span className="text-sm" style={{ color: zone.color }}>
            {zone.icon}
          </span>
          <span className="text-xs font-bold tracking-widest" style={{ color: zone.color, textShadow: `0 0 12px ${zone.glowColor}` }}>
            {zone.label}
          </span>
          <span className="text-[10px] text-gray-500">
            ({zone.min}-{zone.max}V)
          </span>
        </div>

        {showStatusPanel ? (
          <div className="relative z-10 px-4 pb-3">
            <VoltmeterStatusPanel state={state} />
          </div>
        ) : null}

        {showSparkline && state.history.length >= 2 ? (
          <div className="relative z-10 px-4 pb-4">
            <VoltmeterSparkline history={state.history} zone={zone} />
          </div>
        ) : null}

        <div className="relative z-10 border-t border-white/10 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
              {allowTapUpdate && voltage === undefined ? "ТАП: ОБНОВИТЬ" : "АВТОЭЛЕКТРИК · ДИАГНОСТИКА"}
            </span>
            <span className="font-mono text-[9px] text-gray-600">v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Voltmeter;
