export type MeterMode = "voltage" | "current" | "resistance";

export interface MeterZone {
  readonly min: number;
  readonly max: number;
  readonly color: string;
  readonly label: string;
}

export interface MeterChannelConfig {
  readonly mode: MeterMode;
  readonly label: string;
  readonly unit: string;
  readonly unitFull: string;
  readonly icon: string;
  readonly min: number;
  readonly max: number;
  readonly precision: number;
  readonly zones: readonly MeterZone[];
  readonly formatValue: (v: number) => string;
  readonly formatUnit: (v: number) => string;
}

export interface ChannelState {
  value: number;
  zone: MeterZone;
  history: number[];
}

export interface MultimeterProps {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  className?: string;
}

export interface WaveformPoint {
  x: number;
  y: number;
}

