"use client";

import { memo } from "react";

import type { MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

type MeterValueProps = {
  config: MeterChannelConfig;
  value: number;
  zone: MeterZone;
  setRef: (mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | null) => void;
};

export const MeterValue = memo(function MeterValue({ config, value, zone, setRef }: MeterValueProps) {
  return (
    <div className="tabular-nums flex items-baseline gap-1.5">
      <span
        ref={(el) => setRef(config.mode, "valueEl", el)}
        className="font-mono leading-none tracking-tight"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          fontWeight: 200,
          color: zone.color,
          textShadow: `0 0 25px ${zone.color}4d`,
          transition: "color 0.8s ease, text-shadow 0.8s ease",
        }}
      >
        {config.formatValue(value)}
      </span>
      <span
        ref={(el) => setRef(config.mode, "unitEl", el)}
        className="font-mono leading-none"
        style={{
          fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)",
          fontWeight: 400,
          color: zone.color,
          opacity: 0.4,
          transition: "color 0.8s ease",
        }}
      >
        {config.formatUnit(value)}
      </span>
    </div>
  );
});

