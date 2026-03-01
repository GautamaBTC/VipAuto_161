"use client";

import { memo } from "react";

import type { MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

type Props = {
  config: MeterChannelConfig;
  value: number;
  zone: MeterZone;
  setRef: (m: MeterMode, k: keyof ChannelRefs, el: HTMLElement | null) => void;
};

export const MeterValue = memo(function MeterValue({ config, value, zone, setRef }: Props) {
  return (
    <div className="tabular-nums flex items-baseline gap-1">
      <span
        ref={(el) => setRef(config.mode, "valueEl", el)}
        className="font-mono leading-none tracking-tight"
        style={{
          fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
          fontWeight: 200,
          color: zone.color,
          textShadow: `0 0 30px ${zone.color}40`,
          transition: "color 0.8s, text-shadow 0.8s",
        }}
      >
        {config.formatValue(value)}
      </span>
      <span
        ref={(el) => setRef(config.mode, "unitEl", el)}
        className="font-mono leading-none"
        style={{
          fontSize: "clamp(0.6rem, 1.1vw, 0.85rem)",
          fontWeight: 400,
          color: zone.color,
          opacity: 0.35,
          transition: "color 0.8s",
        }}
      >
        {config.formatUnit(value)}
      </span>
    </div>
  );
});
