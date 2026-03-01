"use client";

import { type FC, useMemo } from "react";
import { cn } from "@/lib/cn";

import type { VoltmeterProps } from "./voltmeter.types";
import {
  ARC_LEN,
  CIRCUMFERENCE,
  CX,
  CY,
  R,
  START_DEG,
  STROKE,
  SWEEP_DEG,
  VB,
  V_MAX,
  ZONES,
} from "./voltmeter.constants";
import { useVoltmeter } from "./useVoltmeter";

function Ticks() {
  const ticks = useMemo(() => {
    const out: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = [];
    for (let v = 0; v <= V_MAX; v += 1) {
      const major = v % 5 === 0;
      const frac = v / V_MAX;
      const deg = START_DEG + frac * SWEEP_DEG;
      const rad = (deg * Math.PI) / 180;
      const inner = major ? R - 16 : R - 8;
      const outer = R - 3;
      out.push({
        x1: CX + inner * Math.cos(rad),
        y1: CY + inner * Math.sin(rad),
        x2: CX + outer * Math.cos(rad),
        y2: CY + outer * Math.sin(rad),
        major,
      });
    }
    return out;
  }, []);

  return (
    <g>
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="white"
          strokeWidth={t.major ? 1 : 0.4}
          strokeLinecap="round"
          opacity={t.major ? 0.12 : 0.05}
        />
      ))}
    </g>
  );
}

function ZoneMarkers() {
  return (
    <g>
      {ZONES.map((z) => {
        const startFrac = z.min / V_MAX;
        const endFrac = z.max / V_MAX;
        const len = (endFrac - startFrac) * ARC_LEN;
        const offset = ARC_LEN - startFrac * ARC_LEN;

        return (
          <circle
            key={z.min}
            cx={CX}
            cy={CY}
            r={R + 8}
            fill="none"
            stroke={z.color}
            strokeWidth={1}
            strokeDasharray={`${len} ${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            opacity={0.07}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
          />
        );
      })}
    </g>
  );
}

export const Voltmeter: FC<VoltmeterProps> = ({
  voltage: extVoltage,
  autoAnimate = true,
  animationInterval = 2500,
  opacity = 1,
  className,
  onVoltageChange,
}) => {
  const { voltage, zone, valueRef, ringRef, glowRef, dotRef } = useVoltmeter({
    voltage: extVoltage,
    autoAnimate,
    animationInterval,
    onVoltageChange,
  });

  const initOffset = ARC_LEN - (voltage / V_MAX) * ARC_LEN;

  const dotAngle = START_DEG + (voltage / V_MAX) * SWEEP_DEG;
  const dotRad = (dotAngle * Math.PI) / 180;
  const dotCx = CX + R * Math.cos(dotRad);
  const dotCy = CY + R * Math.sin(dotRad);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden", className)}
      style={{ opacity }}
      aria-hidden
    >
      <div className="relative aspect-square" style={{ width: "clamp(300px, 70vmin, 700px)" }}>
        <svg viewBox={`0 0 ${VB} ${VB}`} className="absolute inset-0 h-full w-full">
          <defs>
            <filter id="vm-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="vm-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <ZoneMarkers />

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="white"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            opacity={0.04}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
          />

          <Ticks />

          <circle
            ref={glowRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={zone.color}
            strokeWidth={20}
            strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
            strokeDashoffset={initOffset}
            strokeLinecap="round"
            opacity={0.06}
            filter="url(#vm-glow)"
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
          />

          <circle
            ref={ringRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={zone.color}
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
            strokeDashoffset={initOffset}
            strokeLinecap="round"
            opacity={0.35}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
          />

          <circle cx={dotCx} cy={dotCy} r={12} fill={zone.color} opacity={0.12} filter="url(#vm-dot-glow)" />

          <circle ref={dotRef} cx={dotCx} cy={dotCy} r={4} fill={zone.color} stroke={zone.color} strokeWidth={0} opacity={0.5} />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={valueRef}
            className="font-mono leading-none"
            style={{
              fontSize: "clamp(3rem, 10vmin, 7rem)",
              fontWeight: 200,
              color: zone.color,
              opacity: 0.12,
              textShadow: `0 0 40px ${zone.color}26`,
              transition: "color 1s ease, text-shadow 1s ease",
              letterSpacing: "-0.02em",
            }}
          >
            {voltage.toFixed(1)}
          </span>

          <span
            className="font-mono leading-none"
            style={{
              fontSize: "clamp(0.75rem, 2vmin, 1.25rem)",
              fontWeight: 300,
              color: zone.color,
              opacity: 0.06,
              marginTop: "clamp(2px, 0.5vmin, 8px)",
              letterSpacing: "0.3em",
              transition: "color 1s ease",
            }}
          >
            VOLTS
          </span>
        </div>
      </div>
    </div>
  );
};

export default Voltmeter;
