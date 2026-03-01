"use client";

import { memo, useMemo } from "react";
import { HISTORY_MAX, VOLTAGE_MAX } from "@/components/voltmeter/voltmeter.constants";
import type { VoltageZone } from "@/components/voltmeter/voltmeter.types";

type SparklineProps = {
  history: number[];
  zone: VoltageZone;
};

export const VoltmeterSparkline = memo(function VoltmeterSparkline({ history, zone }: SparklineProps) {
  const chart = useMemo(() => {
    if (history.length < 2) return null;

    const w = 200;
    const h = 40;
    const pad = 4;

    const points = history.map((value, i) => {
      const x = (i / Math.max(1, HISTORY_MAX - 1)) * w;
      const y = pad + ((VOLTAGE_MAX - value) / VOLTAGE_MAX) * (h - pad * 2);
      return { x, y };
    });

    const line = points.map((point) => `${point.x},${point.y}`).join(" ");
    const first = points[0]!;
    const last = points[points.length - 1]!;
    const area = `M ${first.x},${h} ` + points.map((p) => `L ${p.x},${p.y}`).join(" ") + ` L ${last.x},${h} Z`;

    return { line, area, last };
  }, [history]);

  if (!chart) return null;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/35 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">История</span>
        <span className="font-mono text-[10px] font-bold" style={{ color: zone.color }}>
          {history[history.length - 1]?.toFixed(1)}V
        </span>
      </div>
      <svg viewBox="0 0 200 40" className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="vm-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={zone.color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={zone.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y={4 + ((VOLTAGE_MAX - 14.8) / VOLTAGE_MAX) * 32}
          width="200"
          height={((14.8 - 12.4) / VOLTAGE_MAX) * 32}
          fill="rgba(34, 197, 94, 0.06)"
        />
        <path d={chart.area} fill="url(#vm-spark-fill)" />
        <polyline
          points={chart.line}
          fill="none"
          stroke={zone.color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={chart.last.x} cy={chart.last.y} r={4} fill={zone.color} opacity={0.24}>
          <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={chart.last.x} cy={chart.last.y} r={2.5} fill={zone.color} />
      </svg>
    </div>
  );
});
