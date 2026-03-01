"use client";

import { memo } from "react";
import type { VoltmeterState } from "@/components/voltmeter/voltmeter.types";

type VoltmeterStatusPanelProps = {
  state: VoltmeterState;
};

function getTrendSymbol(trend: VoltmeterState["trend"]): string {
  if (trend === "up") return "▲";
  if (trend === "down") return "▼";
  return "•";
}

function getTrendColor(trend: VoltmeterState["trend"]): string {
  if (trend === "up") return "#22c55e";
  if (trend === "down") return "#ef4444";
  return "#64748b";
}

export const VoltmeterStatusPanel = memo(function VoltmeterStatusPanel({
  state,
}: VoltmeterStatusPanelProps) {
  const { zone, delta, trend } = state;
  const deltaText = `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} V`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5">
        <span className="text-[11px] text-[var(--text-secondary)]">Статус</span>
        <span className="font-mono text-xs font-semibold" style={{ color: zone.color }}>
          {zone.label}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5">
        <span className="text-[11px] text-[var(--text-secondary)]">Δ Напряжение</span>
        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold">
          <span style={{ color: delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#64748b" }}>{deltaText}</span>
          <span style={{ color: getTrendColor(trend) }}>{getTrendSymbol(trend)}</span>
        </span>
      </div>

      <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5">
        <span className="text-[11px] text-[var(--text-secondary)]">Зона</span>
        <span className="font-mono text-xs font-semibold" style={{ color: zone.colorDim }}>
          {zone.min}-{zone.max}V
        </span>
      </div>
    </div>
  );
});
