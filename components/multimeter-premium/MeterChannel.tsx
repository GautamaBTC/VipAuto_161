"use client";

import { memo } from "react";

import type { ChannelState, MeterChannelConfig, MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";
import { MeterArc } from "./MeterArc";
import { MeterValue } from "./MeterValue";
import { MeterWaveform } from "./MeterWaveform";

type MeterChannelProps = {
  config: MeterChannelConfig;
  state: ChannelState;
  setRef: (mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | SVGElement | null) => void;
};

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MeterChannel = memo(function MeterChannel({ config, state, setRef }: MeterChannelProps) {
  const { zone, value } = state;

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md text-[10px]"
            style={{
              backgroundColor: withAlpha(zone.color, 0.12),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.2)}`,
            }}
          >
            {config.icon}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">{config.label}</span>
        </div>

        <span
          className="h-1 w-1 animate-pulse rounded-full"
          style={{
            backgroundColor: zone.color,
            boxShadow: `0 0 4px ${withAlpha(zone.color, 0.8)}`,
          }}
        />
      </div>

      <div className="relative w-full" style={{ maxWidth: "clamp(160px, 22vw, 220px)" }}>
        <MeterArc config={config} zone={zone} value={value} setRef={setRef} />
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <MeterValue config={config} value={value} zone={zone} setRef={setRef} />
        </div>
      </div>

      <div className="w-full px-1">
        <MeterWaveform
          color={zone.color}
          speed={config.mode === "current" ? 1.4 : config.mode === "resistance" ? 0.6 : 1}
          amplitude={config.mode === "current" ? 0.8 : config.mode === "resistance" ? 0.3 : 0.6}
        />
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1"
        style={{
          backgroundColor: withAlpha(zone.color, 0.08),
          border: `1px solid ${withAlpha(zone.color, 0.15)}`,
          transition: "all 0.8s ease",
        }}
      >
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: zone.color }} />
        <span className="text-[9px] font-semibold tracking-[0.15em]" style={{ color: zone.color, transition: "color 0.8s ease" }}>
          {zone.label}
        </span>
      </div>
    </div>
  );
});

