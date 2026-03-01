"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ChannelState, MeterChannelConfig, MeterMode, MeterZone } from "./multimeter.types";
import { CHANNELS, DEMO_SEQUENCES, HISTORY_MAX } from "./multimeter.constants";

function getZone(config: MeterChannelConfig, v: number): MeterZone {
  const clamped = Math.max(config.min, Math.min(config.max, v));
  return config.zones.find((z) => clamped >= z.min && clamped < z.max) ?? config.zones[config.zones.length - 1]!;
}

export interface ChannelRefs {
  valueEl: HTMLSpanElement | null;
  unitEl: HTMLSpanElement | null;
  ringEl: SVGCircleElement | null;
  glowEl: SVGCircleElement | null;
  dotEl: SVGCircleElement | null;
}

type UseMultimeterArgs = {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
};

export function useMultimeter({
  voltage: extV,
  current: extA,
  resistance: extR,
  autoAnimate = true,
  animationInterval = 2800,
}: UseMultimeterArgs) {
  const channelRefs = useRef<Record<MeterMode, ChannelRefs>>({
    voltage: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null },
    current: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null },
    resistance: { valueEl: null, unitEl: null, ringEl: null, glowEl: null, dotEl: null },
  });

  const tweens = useRef<Record<MeterMode, gsap.core.Tween | null>>({
    voltage: null,
    current: null,
    resistance: null,
  });

  const prevValues = useRef<Record<MeterMode, number>>({
    voltage: extV ?? 0,
    current: extA ?? 0,
    resistance: extR ?? 0,
  });

  const demoIdx = useRef<Record<MeterMode, number>>({ voltage: 0, current: 0, resistance: 0 });

  const [states, setStates] = useState<Record<MeterMode, ChannelState>>({
    voltage: { value: extV ?? 0, zone: CHANNELS.voltage.zones[3]!, history: [extV ?? 0] },
    current: { value: extA ?? 0, zone: CHANNELS.current.zones[1]!, history: [extA ?? 0] },
    resistance: { value: extR ?? 0, zone: CHANNELS.resistance.zones[2]!, history: [extR ?? 0] },
  });

  const ARC_R = 82;
  const ARC_CIRC = 2 * Math.PI * ARC_R;
  const ARC_SWEEP = 240;
  const ARC_START = 150;
  const ARC_LEN = ARC_CIRC * (ARC_SWEEP / 360);

  const valueToOffset = useCallback(
    (v: number, config: MeterChannelConfig) => {
      let ratio: number;
      if (config.mode === "resistance") {
        const logMin = Math.log10(Math.max(1, config.min));
        const logMax = Math.log10(config.max);
        const logV = Math.log10(Math.max(1, v));
        ratio = (logV - logMin) / (logMax - logMin);
      } else {
        ratio = (v - config.min) / (config.max - config.min);
      }

      ratio = Math.max(0, Math.min(1, ratio));
      return ARC_LEN - ratio * ARC_LEN;
    },
    [ARC_LEN],
  );

  const animateChannel = useCallback(
    (mode: MeterMode, target: number) => {
      const config = CHANNELS[mode];
      const refs = channelRefs.current[mode];
      const prev = prevValues.current[mode];
      const zone = getZone(config, target);

      tweens.current[mode]?.kill();
      const proxy = { v: prev };

      tweens.current[mode] = gsap.to(proxy, {
        v: target,
        duration: 1.8,
        ease: "power4.out",
        onUpdate() {
          if (refs.valueEl) refs.valueEl.textContent = config.formatValue(proxy.v);
          if (refs.unitEl) refs.unitEl.textContent = config.formatUnit(proxy.v);

          const off = valueToOffset(proxy.v, config);
          if (refs.ringEl) refs.ringEl.style.strokeDashoffset = String(off);
          if (refs.glowEl) refs.glowEl.style.strokeDashoffset = String(off);

          if (refs.dotEl) {
            let ratio: number;
            if (config.mode === "resistance") {
              const logMin = Math.log10(Math.max(1, config.min));
              const logMax = Math.log10(config.max);
              const logV = Math.log10(Math.max(1, proxy.v));
              ratio = (logV - logMin) / (logMax - logMin);
            } else {
              ratio = (proxy.v - config.min) / (config.max - config.min);
            }

            ratio = Math.max(0, Math.min(1, ratio));
            const deg = ARC_START + ratio * ARC_SWEEP;
            const rad = (deg * Math.PI) / 180;
            refs.dotEl.setAttribute("cx", String(100 + ARC_R * Math.cos(rad)));
            refs.dotEl.setAttribute("cy", String(100 + ARC_R * Math.sin(rad)));
          }
        },
        onComplete() {
          prevValues.current[mode] = target;
          setStates((s) => ({
            ...s,
            [mode]: {
              value: target,
              zone,
              history: [...s[mode].history, target].slice(-HISTORY_MAX),
            },
          }));
        },
      });

      const colorTargets = [refs.ringEl, refs.glowEl, refs.dotEl].filter((el): el is SVGCircleElement => el !== null);
      if (colorTargets.length > 0) {
        gsap.to(colorTargets, { stroke: zone.color, fill: zone.color, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      }
    },
    [valueToOffset, ARC_R, ARC_START, ARC_SWEEP],
  );

  useEffect(() => {
    if (extV === undefined) return;
    animateChannel("voltage", extV);
  }, [extV, animateChannel]);

  useEffect(() => {
    if (extA === undefined) return;
    animateChannel("current", extA);
  }, [extA, animateChannel]);

  useEffect(() => {
    if (extR === undefined) return;
    animateChannel("resistance", extR);
  }, [extR, animateChannel]);

  useEffect(() => {
    if (!autoAnimate) return;

    const modes: MeterMode[] = ["voltage", "current", "resistance"];
    modes.forEach((m) => animateChannel(m, DEMO_SEQUENCES[m][0]!));

    const id = window.setInterval(() => {
      modes.forEach((m) => {
        const seq = DEMO_SEQUENCES[m];
        demoIdx.current[m] = (demoIdx.current[m] + 1) % seq.length;
        animateChannel(m, seq[demoIdx.current[m]]!);
      });
    }, animationInterval);

    return () => window.clearInterval(id);
  }, [autoAnimate, animationInterval, animateChannel]);

  useEffect(() => {
    const active = tweens.current;
    return () => {
      Object.values(active).forEach((t) => t?.kill());
    };
  }, []);

  const setRef = useCallback((mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | SVGElement | null) => {
    switch (key) {
      case "valueEl":
      case "unitEl":
        channelRefs.current[mode][key] = el as HTMLSpanElement | null;
        break;
      case "ringEl":
      case "glowEl":
      case "dotEl":
        channelRefs.current[mode][key] = el as SVGCircleElement | null;
        break;
      default:
        break;
    }
  }, []);

  return { states, setRef, animateChannel };
}

