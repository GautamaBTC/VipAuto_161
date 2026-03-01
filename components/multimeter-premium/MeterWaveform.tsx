"use client";

import { memo, useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

type WaveformProps = {
  color: string;
  speed?: number;
  amplitude?: number;
  className?: string;
};

export const MeterWaveform = memo(function MeterWaveform({
  color,
  speed = 1,
  amplitude = 0.6,
  className = "",
}: WaveformProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef(0);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const W = 200;
    const H = 30;
    const mid = H / 2;
    const points = 60;

    const tick = () => {
      phaseRef.current += 0.03 * speed;
      let d = `M 0 ${mid}`;

      for (let i = 0; i <= points; i += 1) {
        const x = (i / points) * W;
        const noise =
          Math.sin(phaseRef.current + i * 0.15) * amplitude * 8 +
          Math.sin(phaseRef.current * 1.7 + i * 0.08) * amplitude * 4 +
          Math.sin(phaseRef.current * 0.5 + i * 0.25) * amplitude * 3;
        const y = mid + noise;
        d += ` L ${x} ${y}`;
      }

      el.setAttribute("d", d);
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, amplitude]);

  return (
    <svg viewBox="0 0 200 30" preserveAspectRatio="none" className={`w-full ${className}`} style={{ height: 28 }} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="15%" stopColor={color} stopOpacity={1} />
          <stop offset="85%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <path ref={pathRef} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
    </svg>
  );
});

