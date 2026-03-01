"use client";

import { memo, useMemo } from "react";
import type { VoltageZone } from "./voltmeter.types";
import { HISTORY_MAX, V_MAX } from "./voltmeter.constants";

type Props = {
  history: number[];
  zone: VoltageZone;
};

export const VoltmeterMiniChart = memo(function VoltmeterMiniChart({ history, zone }: Props) {
  const { line, area, last } = useMemo(() => {
    if (history.length < 2) return { line: "", area: "", last: null as { x: number; y: number } | null };

    const w = 240;
    const h = 32;
    const pad = 2;

    const pts = history.map((v, i) => ({
      x: (i / (HISTORY_MAX - 1)) * w,
      y: pad + ((V_MAX - v) / V_MAX) * (h - pad * 2),
    }));

    const linePath = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const lastPoint = pts[pts.length - 1]!;
    const areaPath = `M ${pts[0]!.x},${h} ${pts.map((p) => `L ${p.x},${p.y}`).join(" ")} L ${lastPoint.x},${h} Z`;

    return { line: linePath, area: areaPath, last: lastPoint };
  }, [history]);

  if (history.length < 2) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
      <svg viewBox="0 0 240 32" className="w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={zone.color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={zone.color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={area} fill="url(#chart-fill)" />
        <polyline points={line} fill="none" stroke={zone.color} strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" opacity={0.7} />

        {last ? (
          <>
            <circle cx={last.x} cy={last.y} r={3} fill={zone.color} opacity={0.2}>
              <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={last.x} cy={last.y} r={2} fill={zone.color} />
          </>
        ) : null}
      </svg>
    </div>
  );
});
