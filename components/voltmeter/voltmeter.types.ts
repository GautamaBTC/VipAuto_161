export interface VoltmeterProps {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  opacity?: number;
  className?: string;
  onVoltageChange?: (voltage: number) => void;
}

export interface VoltageZone {
  readonly min: number;
  readonly max: number;
  readonly color: string;
  readonly severity: "critical" | "warning" | "normal" | "optimal";
}
