"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { VoltageZone, VoltmeterState } from "./voltmeter.types";
import { DEMO_VOLTAGES, HISTORY_MAX, V_MAX, V_MIN, ZONES } from "./voltmeter.constants";

function getZone(v: number): VoltageZone {
  const clamped = Math.max(V_MIN, Math.min(V_MAX, v));
  return ZONES.find((z) => clamped >= z.min && clamped < z.max) ?? ZONES[ZONES.length - 1]!;
}

type UseVoltmeterArgs = {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  onVoltageChange?: (voltage: number) => void;
};

export function useVoltmeter({
  voltage: ext,
  autoAnimate = false,
  animationInterval = 2500,
  onVoltageChange,
}: UseVoltmeterArgs) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const glowRingRef = useRef<SVGCircleElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prevRef = useRef(ext ?? 0);
  const demoIdx = useRef(0);

  const [state, setState] = useState<VoltmeterState>({
    voltage: ext ?? 0,
    zone: getZone(ext ?? 0),
    history: ext === undefined ? [] : [ext],
    trend: "stable",
    delta: 0,
  });

  const animateTo = useCallback(
    (target: number) => {
      const v = Math.max(V_MIN, Math.min(V_MAX, target));
      const zone = getZone(v);
      const prev = prevRef.current;

      tweenRef.current?.kill();
      const proxy = { v: prev };

      tweenRef.current = gsap.to(proxy, {
        v,
        duration: 1.6,
        ease: "power4.out",
        onUpdate() {
          if (valueRef.current) valueRef.current.textContent = proxy.v.toFixed(1);

          const ratio = proxy.v / V_MAX;
          if (ringRef.current) {
            const radius = Number(ringRef.current.getAttribute("r") ?? "130");
            const arcLen = 2 * Math.PI * radius * (270 / 360);
            ringRef.current.style.strokeDashoffset = `${arcLen - ratio * arcLen}`;
            ringRef.current.style.stroke = zone.color;
          }
          if (glowRingRef.current) {
            const radius = Number(glowRingRef.current.getAttribute("r") ?? "130");
            const arcLen = 2 * Math.PI * radius * (270 / 360);
            glowRingRef.current.style.strokeDashoffset = `${arcLen - ratio * arcLen}`;
            glowRingRef.current.style.stroke = zone.color;
          }
        },
        onComplete() {
          prevRef.current = v;
          setState((s) => {
            const history = [...s.history, v].slice(-HISTORY_MAX);
            const delta = +(v - prev).toFixed(2);
            const trend: VoltmeterState["trend"] = Math.abs(delta) < 0.15 ? "stable" : delta > 0 ? "up" : "down";
            return { voltage: v, zone, history, delta, trend };
          });
          onVoltageChange?.(v);
        },
      });
    },
    [onVoltageChange],
  );

  useEffect(() => {
    if (ext !== undefined) animateTo(ext);
  }, [ext, animateTo]);

  useEffect(() => {
    if (!autoAnimate) return;
    const first = DEMO_VOLTAGES[0];
    if (first !== undefined) animateTo(first);

    const id = window.setInterval(() => {
      demoIdx.current = (demoIdx.current + 1) % DEMO_VOLTAGES.length;
      const next = DEMO_VOLTAGES[demoIdx.current];
      if (next !== undefined) animateTo(next);
    }, animationInterval);

    return () => window.clearInterval(id);
  }, [autoAnimate, animationInterval, animateTo]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return {
    state,
    valueRef,
    ringRef,
    glowRingRef,
    wrapRef,
    animateTo,
  };
}
