import type { VoltageZone } from "./voltmeter.types";

export const V_MIN = 0;
export const V_MAX = 30;
export const HISTORY_MAX = 50;

export const ZONES: readonly VoltageZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", label: "КРИТИЧНО", severity: "critical" },
  { min: 8, max: 11.5, color: "#ff8c21", label: "НИЗКОЕ", severity: "warning" },
  { min: 11.5, max: 12.4, color: "#ffd43b", label: "ДОПУСТИМО", severity: "normal" },
  { min: 12.4, max: 14.8, color: "#00e676", label: "НОРМА", severity: "optimal" },
  { min: 14.8, max: 16, color: "#ffd43b", label: "ПОВЫШЕНО", severity: "normal" },
  { min: 16, max: 20, color: "#ff8c21", label: "ВЫСОКОЕ", severity: "warning" },
  { min: 20, max: 30, color: "#ff3b3b", label: "ОПАСНО", severity: "critical" },
] as const;

export const DEMO_VOLTAGES = [
  12.6, 13.2, 14.4, 13.8, 12.9, 15.2, 14.2, 12.8, 13.6, 14.0,
  6.2, 9.8, 11.8, 13.4, 16.8, 22.5, 7.5, 14.1,
] as const;

export const SIZE_CONFIG = {
  sm: { container: 260, ring: 100 },
  md: { container: 340, ring: 130 },
  lg: { container: 400, ring: 155 },
} as const;

export const RING_CX = 160;
export const RING_CY = 160;
export const ARC_GAP_DEG = 90;
export const ARC_SWEEP_DEG = 360 - ARC_GAP_DEG;
export const ARC_START_DEG = 135;
