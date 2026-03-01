export interface VoltmeterProps {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showChart?: boolean;
  className?: string;
  onVoltageChange?: (voltage: number) => void;
}

export interface VoltageZone {
  readonly min: number;
  readonly max: number;
  readonly color: string;
  readonly label: string;
  readonly severity: "critical" | "warning" | "normal" | "optimal";
}

export interface VoltmeterState {
  voltage: number;
  zone: VoltageZone;
  history: number[];
  trend: "up" | "down" | "stable";
  delta: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}
