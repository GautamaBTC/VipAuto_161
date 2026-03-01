"use client";

import { memo, useMemo } from "react";

import type { MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";
import { ARC, ARC_CIRC, ARC_LEN } from "./multimeter.constants";

const { cx, cy, r, stroke, startDeg, sweepDeg } = ARC;

function toRatio(v: number, cfg: MeterChannelConfig): number {
  if (cfg.mode === "resistance") {
    const lo = Math.log10(Math.max(1, cfg.min));
    const hi = Math.log10(cfg.max);
    return Math.max(0, Math.min(1, (Math.log10(Math.max(1, v)) - lo) / (hi - lo)));
  }
  return Math.max(0, Math.min(1, (v - cfg.min) / (cfg.max - cfg.min)));
}

type Props = {
  config: MeterChannelConfig;
  zone: MeterZone;
  value: number;
  setRef: (mode: MeterMode, key: keyof ChannelRefs, el: SVGElement | null) => void;
};

export const MeterArc = memo(function MeterArc({ config, zone, value, setRef }: Props) {
  const ratio = toRatio(value, config);
  const offset = ARC_LEN - ratio * ARC_LEN;
  const dotDeg = startDeg + ratio * sweepDeg;
  const dotRad = (dotDeg * Math.PI) / 180;
  const dotX = cx + r * Math.cos(dotRad);
  const dotY = cy + r * Math.sin(dotRad);
  const id = config.mode;

  const ticks = useMemo(() => {
    const n = config.mode === "resistance" ? 6 : 8;
    const out: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = [];
    for (let i = 0; i <= n * 5; i += 1) {
      const frac = i / (n * 5);
      const deg = startDeg + frac * sweepDeg;
      const rad = (deg * Math.PI) / 180;
      const major = i % 5 === 0;
      const inner = major ? r - 14 : r - 7;
      out.push({
        x1: cx + inner * Math.cos(rad),
        y1: cy + inner * Math.sin(rad),
        x2: cx + (r - 2) * Math.cos(rad),
        y2: cy + (r - 2) * Math.sin(rad),
        major,
      });
    }
    return out;
  }, [config.mode]);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`ag-${id}`} gradientUnits="userSpaceOnUse" x1={cx - r} y1={cy} x2={cx + r} y2={cy}>
          <stop offset="0%" stopColor={zone.color} stopOpacity={0.05} />
          <stop ref={(el) => setRef(config.mode, "gradEl", el)} offset="100%" stopColor={zone.color} stopOpacity={1} />
        </linearGradient>

        <filter id={`gw-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        <filter id={`dg-${id}`} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={stroke}
        strokeDasharray={`${ARC_LEN} ${ARC_CIRC}`}
        strokeLinecap="round"
        transform={`rotate(${startDeg} ${cx} ${cy})`}
      />

      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="white" strokeWidth={t.major ? 0.7 : 0.25} strokeLinecap="round" opacity={t.major ? 0.12 : 0.04} />
      ))}

      <circle
        ref={(el) => setRef(config.mode, "glowEl", el)}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={zone.color}
        strokeWidth={22}
        strokeDasharray={`${ARC_LEN} ${ARC_CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.06}
        filter={`url(#gw-${id})`}
        transform={`rotate(${startDeg} ${cx} ${cy})`}
      />

      <circle
        ref={(el) => setRef(config.mode, "ringEl", el)}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#ag-${id})`}
        strokeWidth={stroke}
        strokeDasharray={`${ARC_LEN} ${ARC_CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.8}
        transform={`rotate(${startDeg} ${cx} ${cy})`}
      />

      <circle cx={dotX} cy={dotY} r={10} fill={zone.color} opacity={0.1} filter={`url(#dg-${id})`} />

      <circle ref={(el) => setRef(config.mode, "dotEl", el)} cx={dotX} cy={dotY} r={3} fill={zone.color} opacity={0.8} />
    </svg>
  );
});
