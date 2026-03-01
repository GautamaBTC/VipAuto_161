import type { VoltageZone } from "./voltmeter.types";

export const V_MIN = 0;
export const V_MAX = 30;

export const ZONES: readonly VoltageZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", severity: "critical" },
  { min: 8, max: 11.5, color: "#ff8c21", severity: "warning" },
  { min: 11.5, max: 12.4, color: "#ffd43b", severity: "normal" },
  { min: 12.4, max: 14.8, color: "#00e676", severity: "optimal" },
  { min: 14.8, max: 16, color: "#ffd43b", severity: "normal" },
  { min: 16, max: 20, color: "#ff8c21", severity: "warning" },
  { min: 20, max: 30, color: "#ff3b3b", severity: "critical" },
] as const;

export const DEMO_VOLTAGES = [
  12.6, 13.2, 14.4, 13.8, 12.9, 15.2, 14.2, 12.8,
  13.6, 14.0, 6.2, 9.8, 11.8, 13.4, 16.8, 22.5, 7.5, 14.1,
] as const;

export const VB = 400;
export const CX = VB / 2;
export const CY = VB / 2;

export const R = 170;
export const STROKE = 3;
export const SWEEP_DEG = 270;
export const START_DEG = 135;
export const CIRCUMFERENCE = 2 * Math.PI * R;
export const ARC_LEN = CIRCUMFERENCE * (SWEEP_DEG / 360);
