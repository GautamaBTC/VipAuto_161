"use client";

import { memo, useMemo } from "react";

import type { MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

const CX = 100;
const CY = 100;
const R = 82;
const CIRC = 2 * Math.PI * R;
const SWEEP = 240;
const START = 150;
const ARC_LEN = CIRC * (SWEEP / 360);
const STROKE = 2.5;

type MeterArcProps = {
  config: MeterChannelConfig;
  zone: MeterZone;
  value: number;
  setRef: (mode: MeterMode, key: keyof ChannelRefs, el: SVGElement | null) => void;
};

export const MeterArc = memo(function MeterArc({ config, zone, value, setRef }: MeterArcProps) {
  const ticks = useMemo(() => {
    const count = config.mode === "resistance" ? 6 : 8;
    const out: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = [];

    for (let i = 0; i <= count * 4; i += 1) {
      const frac = i / (count * 4);
      const deg = START + frac * SWEEP;
      const rad = (deg * Math.PI) / 180;
      const major = i % 4 === 0;
      const inner = major ? R - 12 : R - 6;

      out.push({
        x1: CX + inner * Math.cos(rad),
        y1: CY + inner * Math.sin(rad),
        x2: CX + (R - 2) * Math.cos(rad),
        y2: CY + (R - 2) * Math.sin(rad),
        major,
      });
    }

    return out;
  }, [config.mode]);

  const ratio = (() => {
    if (config.mode === "resistance") {
      const logMin = Math.log10(Math.max(1, config.min));
      const logMax = Math.log10(config.max);
      const logV = Math.log10(Math.max(1, value));
      return Math.max(0, Math.min(1, (logV - logMin) / (logMax - logMin)));
    }

    return Math.max(0, Math.min(1, (value - config.min) / (config.max - config.min)));
  })();

  const offset = ARC_LEN - ratio * ARC_LEN;
  const dotDeg = START + ratio * SWEEP;
  const dotRad = (dotDeg * Math.PI) / 180;
  const dotX = CX + R * Math.cos(dotRad);
  const dotY = CY + R * Math.sin(dotRad);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <filter id={`glow-${config.mode}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={`dot-glow-${config.mode}`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={STROKE}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeLinecap="round"
        transform={`rotate(${START} ${CX} ${CY})`}
      />

      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="white"
          strokeWidth={t.major ? 0.8 : 0.3}
          strokeLinecap="round"
          opacity={t.major ? 0.15 : 0.06}
        />
      ))}

      <circle
        ref={(el) => setRef(config.mode, "glowEl", el)}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={16}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.08}
        filter={`url(#glow-${config.mode})`}
        transform={`rotate(${START} ${CX} ${CY})`}
      />

      <circle
        ref={(el) => setRef(config.mode, "ringEl", el)}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={STROKE}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.65}
        transform={`rotate(${START} ${CX} ${CY})`}
      />

      <circle cx={dotX} cy={dotY} r={8} fill={zone.color} opacity={0.15} filter={`url(#dot-glow-${config.mode})`} />
      <circle ref={(el) => setRef(config.mode, "dotEl", el)} cx={dotX} cy={dotY} r={3} fill={zone.color} opacity={0.7} />
    </svg>
  );
});

