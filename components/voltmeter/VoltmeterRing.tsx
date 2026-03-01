"use client";

import { memo, useMemo, type RefObject } from "react";
import type { VoltageZone } from "./voltmeter.types";
import { V_MAX, ZONES } from "./voltmeter.constants";

const CX = 160;
const CY = 160;
const R = 130;
const STROKE = 3.5;
const CIRC = 2 * Math.PI * R;
const ARC_LEN = CIRC * (270 / 360);
const ROTATION = 135;

type RingProps = {
  voltage: number;
  zone: VoltageZone;
  ringRef: RefObject<SVGCircleElement | null>;
  glowRingRef: RefObject<SVGCircleElement | null>;
};

export const VoltmeterRing = memo(function VoltmeterRing({ voltage, zone, ringRef, glowRingRef }: RingProps) {
  const ratio = Math.max(0, Math.min(1, voltage / V_MAX));
  const offset = ARC_LEN - ratio * ARC_LEN;

  const majorTicks = useMemo(() => {
    const result: Array<{ x1: number; y1: number; x2: number; y2: number; label: number; lx: number; ly: number }> = [];
    for (let v = 0; v <= V_MAX; v += 5) {
      const frac = v / V_MAX;
      const angle = (ROTATION + frac * 270) * (Math.PI / 180);
      const inner = R - 14;
      const outer = R - 6;
      const labelR = R - 26;
      result.push({
        x1: CX + inner * Math.cos(angle),
        y1: CY + inner * Math.sin(angle),
        x2: CX + outer * Math.cos(angle),
        y2: CY + outer * Math.sin(angle),
        label: v,
        lx: CX + labelR * Math.cos(angle),
        ly: CY + labelR * Math.sin(angle),
      });
    }
    return result;
  }, []);

  const minorTicks = useMemo(() => {
    const result: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let v = 0; v <= V_MAX; v += 1) {
      if (v % 5 === 0) continue;
      const frac = v / V_MAX;
      const angle = (ROTATION + frac * 270) * (Math.PI / 180);
      result.push({
        x1: CX + (R - 10) * Math.cos(angle),
        y1: CY + (R - 10) * Math.sin(angle),
        x2: CX + (R - 6) * Math.cos(angle),
        y2: CY + (R - 6) * Math.sin(angle),
      });
    }
    return result;
  }, []);

  const zoneDots = useMemo(() => {
    return ZONES.map((z) => {
      const mid = (z.min + z.max) / 2;
      const frac = mid / V_MAX;
      const angle = (ROTATION + frac * 270) * (Math.PI / 180);
      const dotR = R + 8;
      return { key: z.min, cx: CX + dotR * Math.cos(angle), cy: CY + dotR * Math.sin(angle), color: z.color };
    });
  }, []);

  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden>
      <defs>
        <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={STROKE}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeLinecap="round"
        transform={`rotate(${ROTATION} ${CX} ${CY})`}
      />

      <circle
        ref={glowRingRef}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={STROKE + 10}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.16}
        filter="url(#ring-glow)"
        transform={`rotate(${ROTATION} ${CX} ${CY})`}
      />

      <circle
        ref={ringRef}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={STROKE}
        strokeDasharray={`${ARC_LEN} ${CIRC}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(${ROTATION} ${CX} ${CY})`}
      />

      {minorTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeLinecap="round" />
      ))}

      {majorTicks.map((t) => (
        <g key={t.label}>
          <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} strokeLinecap="round" />
          <text x={t.lx} y={t.ly} fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight={400} textAnchor="middle" dominantBaseline="central">
            {t.label}
          </text>
        </g>
      ))}

      {zoneDots.map((d) => (
        <circle key={d.key} cx={d.cx} cy={d.cy} r={1.8} fill={d.color} opacity={0.5} />
      ))}
    </svg>
  );
});
