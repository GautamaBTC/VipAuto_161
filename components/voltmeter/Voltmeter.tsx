"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function toCoordinates(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180;
  return { x: 110 + Math.cos(rad) * radius, y: 110 + Math.sin(rad) * radius };
}

export function Voltmeter() {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(11.8);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setValue(11.8 + Math.random() * 2.4);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const angle = useMemo(() => -130 + ((value - 10) / 4) * 260, [value]);
  const needleEnd = toCoordinates(angle, 76);
  const status = value >= 12.0 ? "Норма" : "Требуется диагностика";

  return (
    <div className="card-surface mx-auto w-full max-w-[360px] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">VoltMeter 2.0</p>
      <div className="mt-4 flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" aria-label="Индикатор напряжения">
          <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.14)" />
          <path d="M24 110a86 86 0 0 1 172 0" fill="none" stroke="rgba(215,23,23,0.6)" strokeWidth="4" />
          <line x1="110" y1="110" x2={needleEnd.x} y2={needleEnd.y} stroke="#ff5f2e" strokeWidth="3" />
          <circle cx="110" cy="110" r="6" fill="#d71717" />
        </svg>
      </div>
      <div className="mt-2 text-center">
        <p className="font-mono text-3xl font-bold text-[var(--accent-2)]">{value.toFixed(2)}V</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{status}</p>
      </div>
    </div>
  );
}
