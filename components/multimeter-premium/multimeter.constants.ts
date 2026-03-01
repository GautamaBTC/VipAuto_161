import type { MeterChannelConfig, MeterZone } from "./multimeter.types";

const VOLTAGE_ZONES: readonly MeterZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", label: "КРИТИЧНО" },
  { min: 8, max: 11.5, color: "#ff8c21", label: "НИЗКОЕ" },
  { min: 11.5, max: 12.4, color: "#ffd43b", label: "ДОПУСТИМО" },
  { min: 12.4, max: 14.8, color: "#00e676", label: "НОРМА" },
  { min: 14.8, max: 16, color: "#ffd43b", label: "ПОВЫШЕНО" },
  { min: 16, max: 20, color: "#ff8c21", label: "ВЫСОКОЕ" },
  { min: 20, max: 32, color: "#ff3b3b", label: "ОПАСНО" },
] as const;

const CURRENT_ZONES: readonly MeterZone[] = [
  { min: 0, max: 0.5, color: "#64748b", label: "ПОКОЙ" },
  { min: 0.5, max: 5, color: "#00e676", label: "НОРМА" },
  { min: 5, max: 15, color: "#ffd43b", label: "НАГРУЗКА" },
  { min: 15, max: 30, color: "#ff8c21", label: "ВЫСОКИЙ" },
  { min: 30, max: 50, color: "#ff3b3b", label: "КРИТИЧНО" },
] as const;

const RESISTANCE_ZONES: readonly MeterZone[] = [
  { min: 0, max: 1, color: "#00e676", label: "ЗАМКНУТО" },
  { min: 1, max: 100, color: "#22d3ee", label: "НИЗКОЕ" },
  { min: 100, max: 10000, color: "#818cf8", label: "СРЕДНЕЕ" },
  { min: 10000, max: 100000, color: "#ffd43b", label: "ВЫСОКОЕ" },
  { min: 100000, max: 999999, color: "#ff8c21", label: "ОБРЫВ" },
] as const;

function formatResistance(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1);
  if (v >= 1_000) return (v / 1_000).toFixed(1);
  return v.toFixed(1);
}

function formatResistanceUnit(v: number): string {
  if (v >= 1_000_000) return "M?";
  if (v >= 1_000) return "k?";
  return "?";
}

export const CHANNELS: Record<string, MeterChannelConfig> = {
  voltage: {
    mode: "voltage",
    label: "НАПРЯЖЕНИЕ",
    unit: "V",
    unitFull: "Вольт",
    icon: "?",
    min: 0,
    max: 32,
    precision: 1,
    zones: VOLTAGE_ZONES,
    formatValue: (v) => v.toFixed(1),
    formatUnit: () => "V",
  },
  current: {
    mode: "current",
    label: "СИЛА ТОКА",
    unit: "A",
    unitFull: "Ампер",
    icon: "?",
    min: 0,
    max: 50,
    precision: 2,
    zones: CURRENT_ZONES,
    formatValue: (v) => v.toFixed(2),
    formatUnit: () => "A",
  },
  resistance: {
    mode: "resistance",
    label: "СОПРОТИВЛЕНИЕ",
    unit: "?",
    unitFull: "Ом",
    icon: "?",
    min: 0,
    max: 999999,
    precision: 1,
    zones: RESISTANCE_ZONES,
    formatValue: formatResistance,
    formatUnit: formatResistanceUnit,
  },
} as const;

export const DEMO_SEQUENCES = {
  voltage: [12.6, 13.2, 14.4, 13.8, 12.9, 15.2, 14.2, 12.8, 13.6, 14.0, 11.8, 14.4],
  current: [0.3, 2.4, 5.8, 12.1, 3.6, 8.2, 1.1, 15.4, 4.2, 7.8, 2.0, 6.5],
  resistance: [4700, 220, 47000, 1000, 330, 10000, 2200, 560, 100000, 680, 3300, 15000],
} as const;

export const HISTORY_MAX = 40;

export const ARC = {
  cx: 100,
  cy: 100,
  r: 82,
  stroke: 3,
  sweepDeg: 240,
  startDeg: 150,
  get circumference() {
    return 2 * Math.PI * this.r;
  },
  get arcLen() {
    return this.circumference * (this.sweepDeg / 360);
  },
} as const;

