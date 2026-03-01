"use client";

import { memo, useMemo } from "react";
import { SEVEN_SEGMENTS } from "@/components/voltmeter/voltmeter.constants";
import type { SegmentDigit, VoltageZone } from "@/components/voltmeter/voltmeter.types";

type SegmentDisplayProps = {
  voltage: number;
  zone: VoltageZone;
};

type SegmentBarProps = {
  active: boolean;
  color: string;
  glowColor: string;
  d: string;
};

const PATHS = [
  "M 6 2 L 34 2 L 30 8 L 10 8 Z",
  "M 36 4 L 36 32 L 32 28 L 32 8 Z",
  "M 36 38 L 36 66 L 32 62 L 32 42 Z",
  "M 6 68 L 34 68 L 30 62 L 10 62 Z",
  "M 4 38 L 4 66 L 8 62 L 8 42 Z",
  "M 4 4 L 4 32 L 8 28 L 8 8 Z",
  "M 6 35 L 10 31 L 30 31 L 34 35 L 30 39 L 10 39 Z",
] as const;

const SegmentBar = memo(function SegmentBar({ active, color, glowColor, d }: SegmentBarProps) {
  return (
    <path
      d={d}
      fill={active ? color : "rgba(255,255,255,0.04)"}
      style={
        active
          ? { filter: `drop-shadow(0 0 4px ${glowColor})`, transition: "fill 0.16s ease, filter 0.16s ease" }
          : { transition: "fill 0.28s ease, filter 0.28s ease" }
      }
    />
  );
});

const SingleDigit = memo(function SingleDigit({
  char,
  color,
  glowColor,
}: {
  char: SegmentDigit;
  color: string;
  glowColor: string;
}) {
  if (char === ".") {
    return (
      <svg viewBox="0 0 16 70" className="h-full w-[18%]">
        <circle cx="8" cy="65" r="4" fill={color} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} />
      </svg>
    );
  }

  const active = SEVEN_SEGMENTS[char] ?? SEVEN_SEGMENTS[" "];
  return (
    <svg viewBox="0 0 40 70" className="h-full w-full">
      {PATHS.map((path, i) => (
        <SegmentBar key={path} d={path} active={active[i] ?? false} color={color} glowColor={glowColor} />
      ))}
    </svg>
  );
});

function formatVoltage(voltage: number): SegmentDigit[] {
  const value = Math.max(0, Math.min(99.9, voltage)).toFixed(1).padStart(4, " ");
  return value.split("").map((char) => {
    if (char === "." || char === "-" || char === " ") return char;
    if (char >= "0" && char <= "9") return char;
    return " ";
  }) as SegmentDigit[];
}

export const VoltmeterSegmentDisplay = memo(function VoltmeterSegmentDisplay({
  voltage,
  zone,
}: SegmentDisplayProps) {
  const chars = useMemo(() => formatVoltage(voltage), [voltage]);

  return (
    <div className="flex h-16 items-center justify-center gap-[2px]">
      {chars.map((char, i) => (
        <SingleDigit key={`${i}-${char}`} char={char} color={zone.color} glowColor={zone.glowColor} />
      ))}
    </div>
  );
});
