export type VoltmeterSize = "sm" | "md" | "lg" | "xl";

export type VoltageSeverity = "critical" | "warning" | "normal" | "optimal";

export type VoltageTrend = "up" | "down" | "stable";

export type SegmentDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "." | "-" | " ";

export interface VoltmeterProps {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  size?: VoltmeterSize;
  label?: string;
  showSparkline?: boolean;
  showStatusPanel?: boolean;
  className?: string;
  onVoltageChange?: (voltage: number) => void;
}

export interface VoltageZone {
  readonly min: number;
  readonly max: number;
  readonly color: string;
  readonly colorDim: string;
  readonly glowColor: string;
  readonly bgGlow: string;
  readonly label: string;
  readonly labelEn: string;
  readonly severity: VoltageSeverity;
  readonly icon: string;
}

export interface VoltmeterState {
  voltage: number;
  displayVoltage: number;
  zone: VoltageZone;
  history: number[];
  delta: number;
  trend: VoltageTrend;
}
