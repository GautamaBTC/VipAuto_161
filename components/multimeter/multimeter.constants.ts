import type { MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";

const VOLTAGE_ZONES: readonly MeterZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", label: "КРИТИЧНО" },
  { min: 8, max: 11.5, color: "#ff8c21", label: "НИЗКОЕ" },
  { min: 11.5, max: 12.4, color: "#ffd43b", label: "ДОПУСТИМО" },
  { min: 12.4, max: 14.8, color: "#00e676", label: "НОРМА" },
  { min: 14.8, max: 16, color: "#ffd43b", label: "ПОВЫШЕНО" },
  { min: 16, max: 20, color: "#ff8c21", label: "ВЫСОКОЕ" },
  { min: 20, max: 32, color: "#ff3b3b", label: "ОПАСНО" },
];

const CURRENT_ZONES: readonly MeterZone[] = [
  { min: 0, max: 0.5, color: "#475569", label: "ПОКОЙ" },
  { min: 0.5, max: 5, color: "#00e676", label: "НОРМА" },
  { min: 5, max: 15, color: "#ffd43b", label: "НАГРУЗКА" },
  { min: 15, max: 30, color: "#ff8c21", label: "ВЫСОКИЙ" },
  { min: 30, max: 50, color: "#ff3b3b", label: "КРИТИЧНО" },
];

const RESISTANCE_ZONES: readonly MeterZone[] = [
  { min: 0, max: 1, color: "#00e676", label: "КЗ" },
  { min: 1, max: 100, color: "#22d3ee", label: "НИЗКОЕ" },
  { min: 100, max: 10000, color: "#818cf8", label: "СРЕДНЕЕ" },
  { min: 10000, max: 100000, color: "#ffd43b", label: "ВЫСОКОЕ" },
  { min: 100000, max: 999999, color: "#ff8c21", label: "ОБРЫВ" },
];

function fmtResistance(v: number): string {
  if (v >= 1e6) return (v / 1e6).toFixed(1);
  if (v >= 1e3) return (v / 1e3).toFixed(1);
  return v.toFixed(0);
}

function fmtResistanceUnit(v: number): string {
  if (v >= 1e6) return "MΩ";
  if (v >= 1e3) return "kΩ";
  return "Ω";
}

export const CHANNELS: Record<MeterMode, MeterChannelConfig> = {
  voltage: {
    mode: "voltage",
    label: "VOLTAGE",
    unit: "V",
    icon: "V",
    min: 0,
    max: 32,
    zones: VOLTAGE_ZONES,
    formatValue: (v) => v.toFixed(1),
    formatUnit: () => "V",
    wave: { speed: 1, complexity: 3, amplitude: 0.7 },
  },
  current: {
    mode: "current",
    label: "CURRENT",
    unit: "A",
    icon: "A",
    min: 0,
    max: 50,
    zones: CURRENT_ZONES,
    formatValue: (v) => v.toFixed(2),
    formatUnit: () => "A",
    wave: { speed: 1.5, complexity: 5, amplitude: 0.9 },
  },
  resistance: {
    mode: "resistance",
    label: "RESISTANCE",
    unit: "Ω",
    icon: "Ω",
    min: 0,
    max: 999999,
    zones: RESISTANCE_ZONES,
    formatValue: fmtResistance,
    formatUnit: fmtResistanceUnit,
    wave: { speed: 0.4, complexity: 2, amplitude: 0.3 },
  },
};

export const DEMO: Record<MeterMode, readonly number[]> = {
  voltage: [12.6, 13.2, 14.4, 13.8, 12.9, 15.2, 14.2, 12.8, 13.6, 14, 11.8, 14.4],
  current: [0.3, 2.4, 5.8, 12.1, 3.6, 8.2, 1.1, 15.4, 4.2, 7.8, 2, 6.5],
  resistance: [4700, 220, 47000, 1000, 330, 10000, 2200, 560, 100000, 680, 3300, 15000],
};

export const HISTORY_MAX = 50;

export const ARC = {
  viewBox: 200,
  cx: 100,
  cy: 100,
  r: 80,
  stroke: 3,
  sweepDeg: 240,
  startDeg: 150,
} as const;

export const ARC_CIRC = 2 * Math.PI * ARC.r;
export const ARC_LEN = ARC_CIRC * (ARC.sweepDeg / 360);
