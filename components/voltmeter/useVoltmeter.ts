"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  DEMO_VOLTAGES,
  HISTORY_MAX,
  VOLTAGE_MAX,
  VOLTAGE_MIN,
  VOLTAGE_ZONES,
} from "@/components/voltmeter/voltmeter.constants";
import type { VoltageTrend, VoltageZone, VoltmeterState } from "@/components/voltmeter/voltmeter.types";

interface UseVoltmeterOptions {
  voltage?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  onVoltageChange?: (voltage: number) => void;
}

function clampVoltage(voltage: number): number {
  return Math.max(VOLTAGE_MIN, Math.min(VOLTAGE_MAX, voltage));
}

export function getZone(voltage: number): VoltageZone {
  const v = clampVoltage(voltage);
  return (
    VOLTAGE_ZONES.find((zone) => v >= zone.min && v < zone.max) ??
    VOLTAGE_ZONES[VOLTAGE_ZONES.length - 1]!
  );
}

export function useVoltmeter({
  voltage: externalVoltage,
  autoAnimate = false,
  animationInterval = 2500,
  onVoltageChange,
}: UseVoltmeterOptions) {
  const [state, setState] = useState<VoltmeterState>(() => {
    const initial = clampVoltage(externalVoltage ?? 13.6);
    return {
      voltage: initial,
      displayVoltage: initial,
      zone: getZone(initial),
      history: [initial],
      delta: 0,
      trend: "stable",
    };
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const demoIndexRef = useRef(0);
  const latestVoltageRef = useRef(state.voltage);

  const animateTo = useCallback(
    (targetVoltage: number) => {
      const clamped = clampVoltage(targetVoltage);
      const previous = latestVoltageRef.current;
      const nextZone = getZone(clamped);
      const proxy = { value: previous };

      tweenRef.current?.kill();

      tweenRef.current = gsap.to(proxy, {
        value: clamped,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () => {
          setState((prev) => ({
            ...prev,
            displayVoltage: proxy.value,
            zone: getZone(proxy.value),
          }));
        },
        onComplete: () => {
          latestVoltageRef.current = clamped;
          setState((prev) => {
            const history = [...prev.history, clamped].slice(-HISTORY_MAX);
            const delta = +(clamped - previous).toFixed(2);
            const trend: VoltageTrend =
              Math.abs(delta) < 0.15 ? "stable" : delta > 0 ? "up" : "down";

            return {
              voltage: clamped,
              displayVoltage: clamped,
              zone: nextZone,
              history,
              delta,
              trend,
            };
          });
          onVoltageChange?.(clamped);
        },
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          background: `radial-gradient(ellipse at 50% 30%, ${nextZone.bgGlow} 0%, transparent 70%)`,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      if (
        containerRef.current &&
        (nextZone.severity === "critical" || nextZone.severity === "warning")
      ) {
        gsap.fromTo(
          containerRef.current,
          { scale: 1 },
          {
            scale: 1.012,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
        );
      }
    },
    [onVoltageChange],
  );

  useEffect(() => {
    if (externalVoltage === undefined) return;
    animateTo(externalVoltage);
  }, [animateTo, externalVoltage]);

  useEffect(() => {
    if (!autoAnimate) return;

    const first = DEMO_VOLTAGES[0];
    if (first !== undefined) animateTo(first);

    const timer = window.setInterval(() => {
      demoIndexRef.current = (demoIndexRef.current + 1) % DEMO_VOLTAGES.length;
      const next = DEMO_VOLTAGES[demoIndexRef.current];
      if (next !== undefined) animateTo(next);
    }, animationInterval);

    return () => window.clearInterval(timer);
  }, [animateTo, animationInterval, autoAnimate]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return {
    state,
    containerRef,
    glowRef,
    animateTo,
  };
}
