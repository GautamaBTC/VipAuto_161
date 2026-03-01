"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ChannelState, MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import { ARC, ARC_LEN, CHANNELS, DEMO, HISTORY_MAX } from "./multimeter.constants";

function getZone(cfg: MeterChannelConfig, v: number): MeterZone {
  const c = Math.max(cfg.min, Math.min(cfg.max, v));
  return cfg.zones.find((z) => c >= z.min && c < z.max) ?? cfg.zones[cfg.zones.length - 1]!;
}

function toRatio(v: number, cfg: MeterChannelConfig): number {
  if (cfg.mode === "resistance") {
    const lo = Math.log10(Math.max(1, cfg.min));
    const hi = Math.log10(cfg.max);
    return Math.max(0, Math.min(1, (Math.log10(Math.max(1, v)) - lo) / (hi - lo)));
  }
  return Math.max(0, Math.min(1, (v - cfg.min) / (cfg.max - cfg.min)));
}

export interface ChannelRefs {
  valueEl: HTMLSpanElement | null;
  unitEl: HTMLSpanElement | null;
  ringEl: SVGCircleElement | null;
  glowEl: SVGCircleElement | null;
  dotEl: SVGCircleElement | null;
  gradEl: SVGStopElement | null;
  labelEl: HTMLSpanElement | null;
}

type StateMap = Record<MeterMode, ChannelState>;

type UseMultimeterArgs = {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  reducedMotion?: boolean;
};

export function useMultimeter({
  voltage: extV,
  current: extA,
  resistance: extR,
  autoAnimate = true,
  animationInterval = 2800,
  reducedMotion = false,
}: UseMultimeterArgs) {
  const refsMap = useRef<Record<MeterMode, ChannelRefs>>({
    voltage: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null, gradEl: null, labelEl: null },
    current: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null, gradEl: null, labelEl: null },
    resistance: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null, gradEl: null, labelEl: null },
  });

  const tweens = useRef<Record<MeterMode, gsap.core.Tween | null>>({ voltage: null, current: null, resistance: null });
  const prevs = useRef<Record<MeterMode, number>>({ voltage: extV ?? 0, current: extA ?? 0, resistance: extR ?? 0 });
  const demoI = useRef<Record<MeterMode, number>>({ voltage: 0, current: 0, resistance: 0 });

  const [states, setStates] = useState<StateMap>(() => {
    const init = (m: MeterMode, v: number): ChannelState => ({
      value: v,
      zone: getZone(CHANNELS[m], v),
      history: [v],
      prevValue: v,
    });

    return {
      voltage: init("voltage", extV ?? 0),
      current: init("current", extA ?? 0),
      resistance: init("resistance", extR ?? 0),
    };
  });

  const animate = useCallback(
    (mode: MeterMode, target: number) => {
      const cfg = CHANNELS[mode];
      const refs = refsMap.current[mode];
      const prev = prevs.current[mode];
      const zone = getZone(cfg, target);
      const duration = reducedMotion ? 0.01 : 1.8;

      tweens.current[mode]?.kill();
      const proxy = { v: prev };

      tweens.current[mode] = gsap.to(proxy, {
        v: target,
        duration,
        ease: "power4.out",
        onUpdate() {
          if (refs.valueEl) refs.valueEl.textContent = cfg.formatValue(proxy.v);
          if (refs.unitEl) refs.unitEl.textContent = cfg.formatUnit(proxy.v);

          const ratio = toRatio(proxy.v, cfg);
          const off = ARC_LEN - ratio * ARC_LEN;
          if (refs.ringEl) refs.ringEl.style.strokeDashoffset = String(off);
          if (refs.glowEl) refs.glowEl.style.strokeDashoffset = String(off);

          if (refs.dotEl) {
            const deg = ARC.startDeg + ratio * ARC.sweepDeg;
            const rad = (deg * Math.PI) / 180;
            refs.dotEl.setAttribute("cx", String(ARC.cx + ARC.r * Math.cos(rad)));
            refs.dotEl.setAttribute("cy", String(ARC.cy + ARC.r * Math.sin(rad)));
          }
        },
        onComplete() {
          prevs.current[mode] = target;
          setStates((s) => ({
            ...s,
            [mode]: {
              value: target,
              zone,
              history: [...s[mode].history, target].slice(-HISTORY_MAX),
              prevValue: prev,
            },
          }));
        },
      });

      const svgTargets = [refs.ringEl, refs.glowEl].filter((el): el is SVGCircleElement => el !== null);
      if (svgTargets.length > 0) gsap.to(svgTargets, { stroke: zone.color, duration: 0.6, ease: "none", overwrite: "auto" });
      if (refs.dotEl) gsap.to(refs.dotEl, { stroke: zone.color, fill: zone.color, duration: 0.6, overwrite: "auto" });
      if (refs.gradEl) gsap.to(refs.gradEl, { attr: { "stop-color": zone.color }, duration: 0.6, overwrite: "auto" });
      if (refs.labelEl) gsap.to(refs.labelEl, { color: zone.color, duration: 0.6, overwrite: "auto" });
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (extV === undefined) return;
    const id = window.requestAnimationFrame(() => animate("voltage", extV));
    return () => window.cancelAnimationFrame(id);
  }, [extV, animate]);

  useEffect(() => {
    if (extA === undefined) return;
    const id = window.requestAnimationFrame(() => animate("current", extA));
    return () => window.cancelAnimationFrame(id);
  }, [extA, animate]);

  useEffect(() => {
    if (extR === undefined) return;
    const id = window.requestAnimationFrame(() => animate("resistance", extR));
    return () => window.cancelAnimationFrame(id);
  }, [extR, animate]);

  useEffect(() => {
    if (!autoAnimate) return;

    const modes: MeterMode[] = ["voltage", "current", "resistance"];
    const startFrame = window.requestAnimationFrame(() => {
      modes.forEach((m) => {
        const first = DEMO[m][0];
        if (first !== undefined) animate(m, first);
      });
    });

    const id = window.setInterval(() => {
      modes.forEach((m) => {
        demoI.current[m] = (demoI.current[m] + 1) % DEMO[m].length;
        const next = DEMO[m][demoI.current[m]];
        if (next !== undefined) animate(m, next);
      });
    }, animationInterval);

    return () => {
      window.cancelAnimationFrame(startFrame);
      window.clearInterval(id);
    };
  }, [autoAnimate, animationInterval, animate]);

  useEffect(() => {
    const activeTweens = tweens.current;
    return () => {
      Object.values(activeTweens).forEach((t) => t?.kill());
    };
  }, []);

  const setRef = useCallback((mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | SVGElement | null) => {
    const channelRefs = refsMap.current[mode];
    switch (key) {
      case "valueEl":
      case "unitEl":
      case "labelEl":
        channelRefs[key] = el as HTMLSpanElement | null;
        break;
      case "ringEl":
      case "glowEl":
      case "dotEl":
        channelRefs[key] = el as SVGCircleElement | null;
        break;
      case "gradEl":
        channelRefs[key] = el as SVGStopElement | null;
        break;
      default:
        break;
    }
  }, []);

  return { states, setRef, animate };
}

