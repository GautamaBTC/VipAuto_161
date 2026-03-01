"use client";

import { memo, forwardRef } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { VoltageZone, VoltmeterState } from "./voltmeter.types";

type Props = {
  voltage: number;
  zone: VoltageZone;
  trend: VoltmeterState["trend"];
  delta: number;
};

export const VoltmeterValue = memo(
  forwardRef<HTMLSpanElement, Props>(function VoltmeterValue({ voltage, zone, trend, delta }, ref) {
    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "rgba(255,255,255,0.25)";

    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="relative flex items-baseline gap-1">
          <span
            ref={ref}
            className="font-mono text-5xl font-extralight tracking-tight"
            style={{
              color: zone.color,
              textShadow: `0 0 30px ${zone.color}66, 0 0 60px ${zone.color}33`,
              transition: "color 0.6s ease, text-shadow 0.6s ease",
            }}
          >
            {voltage.toFixed(1)}
          </span>
          <span className="text-lg font-extralight" style={{ color: zone.color, opacity: 0.45, transition: "color 0.6s ease" }}>
            V
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <TrendIcon className="h-3 w-3" style={{ color: trendColor }} strokeWidth={1.5} />
          <span className="font-mono text-[10px] font-medium" style={{ color: trendColor }}>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
          </span>
        </div>
      </div>
    );
  }),
);
