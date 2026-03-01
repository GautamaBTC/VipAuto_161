"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { VoltageZone } from "./voltmeter.types";
import { ARC_LEN, DEMO_VOLTAGES, V_MAX, V_MIN, ZONES } from "./voltmeter.constants";

function getZone(v: number): VoltageZone {
  const c = Math.max(V_MIN, Math.min(V_MAX, v));
  return ZONES.find((z) => c >= z.min && c < z.max) ?? ZONES[ZONES.length - 1]!;
}

function toOffset(v: number): number {
  const clamped = Math.max(V_MIN, Math.min(V_MAX, v));
  return ARC_LEN - (clamped / V_MAX) * ARC_LEN;
}

type UseVoltmeterArgs = {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  onVoltageChange?: (v: number) => void;
};

export function useVoltmeter({
  voltage: ext,
  autoAnimate = false,
  animationInterval = 2500,
  onVoltageChange,
}: UseVoltmeterArgs) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prevRef = useRef(ext ?? 0);
  const demoIdx = useRef(0);

  const [zone, setZone] = useState<VoltageZone>(() => getZone(ext ?? 0));
  const [voltage, setVoltage] = useState(ext ?? 0);

  const animateTo = useCallback(
    (target: number) => {
      const v = Math.max(V_MIN, Math.min(V_MAX, target));
      const z = getZone(v);

      tweenRef.current?.kill();
      const proxy = { v: prevRef.current };

      tweenRef.current = gsap.to(proxy, {
        v,
        duration: 2,
        ease: "power4.out",
        onUpdate() {
          if (valueRef.current) valueRef.current.textContent = proxy.v.toFixed(1);

          const offset = toOffset(proxy.v);
          if (ringRef.current) ringRef.current.style.strokeDashoffset = String(offset);
          if (glowRef.current) glowRef.current.style.strokeDashoffset = String(offset);

          if (dotRef.current) {
            const ratio = Math.max(V_MIN, Math.min(V_MAX, proxy.v)) / V_MAX;
            const angleDeg = 135 + ratio * 270;
            const rad = (angleDeg * Math.PI) / 180;
            const cx = 200 + 170 * Math.cos(rad);
            const cy = 200 + 170 * Math.sin(rad);
            dotRef.current.setAttribute("cx", String(cx));
            dotRef.current.setAttribute("cy", String(cy));
          }
        },
        onComplete() {
          prevRef.current = v;
          setVoltage(v);
          setZone(z);
          onVoltageChange?.(v);
        },
      });

      const targets = [ringRef.current, glowRef.current, dotRef.current].filter(
        (t): t is SVGCircleElement => t !== null,
      );
      if (targets.length > 0) {
        gsap.to(targets, {
          stroke: z.color,
          duration: 1,
          ease: "power2.out",
        });
      }
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          fill: z.color,
          duration: 1,
          ease: "power2.out",
        });
      }

      setZone(z);
    },
    [onVoltageChange],
  );

  useEffect(() => {
    if (ext === undefined) return;
    const id = window.requestAnimationFrame(() => animateTo(ext));
    return () => window.cancelAnimationFrame(id);
  }, [ext, animateTo]);

  useEffect(() => {
    if (!autoAnimate) return;

    const first = DEMO_VOLTAGES[0];
    let firstFrame = 0;
    if (first !== undefined) {
      firstFrame = window.requestAnimationFrame(() => animateTo(first));
    }

    const id = window.setInterval(() => {
      demoIdx.current = (demoIdx.current + 1) % DEMO_VOLTAGES.length;
      const next = DEMO_VOLTAGES[demoIdx.current];
      if (next !== undefined) animateTo(next);
    }, animationInterval);

    return () => {
      if (firstFrame) window.cancelAnimationFrame(firstFrame);
      window.clearInterval(id);
    };
  }, [autoAnimate, animationInterval, animateTo]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return { voltage, zone, valueRef, ringRef, glowRef, dotRef, animateTo };
}
