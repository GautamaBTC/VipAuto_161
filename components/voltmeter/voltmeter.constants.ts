import type { SegmentDigit, VoltageZone } from "./voltmeter.types";

export const VOLTAGE_MIN = 0 as const;
export const VOLTAGE_MAX = 30 as const;

export const ARC_START_ANGLE = 135 as const;
export const ARC_END_ANGLE = 405 as const;
export const ARC_TOTAL = ARC_END_ANGLE - ARC_START_ANGLE;

export const VOLTAGE_ZONES: readonly VoltageZone[] = [
  {
    min: 0,
    max: 8,
    color: "#ef4444",
    colorDim: "#7f1d1d",
    glowColor: "rgba(239, 68, 68, 0.8)",
    bgGlow: "rgba(239, 68, 68, 0.09)",
    label: "КРИТИЧНО",
    labelEn: "CRITICAL",
    severity: "critical",
    icon: "!",
  },
  {
    min: 8,
    max: 11.5,
    color: "#f97316",
    colorDim: "#7c2d12",
    glowColor: "rgba(249, 115, 22, 0.7)",
    bgGlow: "rgba(249, 115, 22, 0.07)",
    label: "НИЗКОЕ",
    labelEn: "LOW",
    severity: "warning",
    icon: "!",
  },
  {
    min: 11.5,
    max: 12.4,
    color: "#eab308",
    colorDim: "#713f12",
    glowColor: "rgba(234, 179, 8, 0.65)",
    bgGlow: "rgba(234, 179, 8, 0.06)",
    label: "ДОПУСТИМО",
    labelEn: "ACCEPTABLE",
    severity: "normal",
    icon: "~",
  },
  {
    min: 12.4,
    max: 14.8,
    color: "#22c55e",
    colorDim: "#14532d",
    glowColor: "rgba(34, 197, 94, 0.7)",
    bgGlow: "rgba(34, 197, 94, 0.07)",
    label: "НОРМА",
    labelEn: "OPTIMAL",
    severity: "optimal",
    icon: "+",
  },
  {
    min: 14.8,
    max: 16,
    color: "#eab308",
    colorDim: "#713f12",
    glowColor: "rgba(234, 179, 8, 0.65)",
    bgGlow: "rgba(234, 179, 8, 0.06)",
    label: "ПОВЫШЕНО",
    labelEn: "ELEVATED",
    severity: "normal",
    icon: "~",
  },
  {
    min: 16,
    max: 20,
    color: "#f97316",
    colorDim: "#7c2d12",
    glowColor: "rgba(249, 115, 22, 0.7)",
    bgGlow: "rgba(249, 115, 22, 0.07)",
    label: "ВЫСОКОЕ",
    labelEn: "HIGH",
    severity: "warning",
    icon: "!",
  },
  {
    min: 20,
    max: 30,
    color: "#ef4444",
    colorDim: "#7f1d1d",
    glowColor: "rgba(239, 68, 68, 0.8)",
    bgGlow: "rgba(239, 68, 68, 0.09)",
    label: "ОПАСНО",
    labelEn: "DANGER",
    severity: "critical",
    icon: "!",
  },
] as const;

export const SEVEN_SEGMENTS: Record<SegmentDigit, readonly boolean[]> = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true],
  "-": [false, false, false, false, false, false, true],
  " ": [false, false, false, false, false, false, false],
  ".": [false, false, false, false, false, false, false],
};

export const SIZE_MAP = {
  sm: { width: 280, height: 340 },
  md: { width: 360, height: 430 },
  lg: { width: 440, height: 520 },
  xl: { width: 540, height: 630 },
} as const;

export const DEMO_VOLTAGES = [
  0.5, 6.2, 9.8, 11.8, 12.6, 13.2, 14.4, 13.8, 12.9, 15.2, 16.8, 22.5, 14.2, 12.8, 7.5, 13.6, 14.0, 13.4,
] as const;

export const HISTORY_MAX = 40 as const;
