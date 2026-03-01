"use client";

import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ARC_START_ANGLE,
  ARC_TOTAL,
  VOLTAGE_MAX,
  VOLTAGE_ZONES,
} from "@/components/voltmeter/voltmeter.constants";
import type { VoltageZone } from "@/components/voltmeter/voltmeter.types";

type VoltmeterArcBarProps = {
  voltage: number;
  zone: VoltageZone;
};

const CX = 160;
const CY = 160;
const R = 130;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_LENGTH = (ARC_TOTAL / 360) * CIRCUMFERENCE;

function voltageToOffset(voltage: number): number {
  const ratio = Math.max(0, Math.min(1, voltage / VOLTAGE_MAX));
  return ARC_LENGTH - ratio * ARC_LENGTH;
}

function segmentDash(start: number, end: number): { offset: number; length: number } {
  const startRatio = start / VOLTAGE_MAX;
  const endRatio = end / VOLTAGE_MAX;
  return {
    offset: ARC_LENGTH - startRatio * ARC_LENGTH,
    length: (endRatio - startRatio) * ARC_LENGTH,
  };
}

export const VoltmeterArcBar = memo(function VoltmeterArcBar({ voltage, zone }: VoltmeterArcBarProps) {
  const progressRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const offset = voltageToOffset(voltage);
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        strokeDashoffset: offset,
        stroke: zone.color,
        duration: 1.2,
        ease: "power3.out",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        strokeDashoffset: offset,
        stroke: zone.color,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  }, [voltage, zone.color]);

  const ticks = Array.from({ length: VOLTAGE_MAX + 1 }, (_, i) => {
    const ratio = i / VOLTAGE_MAX;
    const angle = ARC_START_ANGLE + ratio * ARC_TOTAL;
    const rad = (angle * Math.PI) / 180;
    const major = i % 5 === 0;
    const innerR = major ? R - 24 : R - 16;
    const outerR = R - 8;

    return {
      key: i,
      major,
      value: i,
      x1: CX + innerR * Math.cos(rad),
      y1: CY + innerR * Math.sin(rad),
      x2: CX + outerR * Math.cos(rad),
      y2: CY + outerR * Math.sin(rad),
      lx: CX + (R - 34) * Math.cos(rad),
      ly: CY + (R - 34) * Math.sin(rad),
    };
  });

  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden>
      <defs>
        <filter id="vm-arc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {VOLTAGE_ZONES.map((item) => {
        const dash = segmentDash(item.min, item.max);
        return (
          <circle
            key={`${item.min}-${item.max}`}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={item.colorDim}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            strokeDasharray={`${dash.length} ${CIRCUMFERENCE}`}
            strokeDashoffset={dash.offset}
            opacity={0.36}
            transform={`rotate(${ARC_START_ANGLE} ${CX} ${CY})`}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        );
      })}

      <circle
        ref={glowRef}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={STROKE + 8}
        strokeLinecap="round"
        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
        strokeDashoffset={voltageToOffset(voltage)}
        opacity={0.22}
        filter="url(#vm-arc-glow)"
        transform={`rotate(${ARC_START_ANGLE} ${CX} ${CY})`}
      />

      <circle
        ref={progressRef}
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={zone.color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
        strokeDashoffset={voltageToOffset(voltage)}
        transform={`rotate(${ARC_START_ANGLE} ${CX} ${CY})`}
      />

      {ticks.map((tick) => (
        <g key={tick.key}>
          <line
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? "#94a3b8" : "#334155"}
            strokeWidth={tick.major ? 2 : 1}
            strokeLinecap="round"
          />
          {tick.major ? (
            <text
              x={tick.lx}
              y={tick.ly}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="var(--font-jetbrains-mono), monospace"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {tick.value}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
});
