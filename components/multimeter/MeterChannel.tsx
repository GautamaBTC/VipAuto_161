"use client";

import { memo, useCallback, useRef } from "react";
import { gsap } from "gsap";

import type { ChannelState, MeterChannelConfig, MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";
import { MeterArc } from "./MeterArc";
import { MeterValue } from "./MeterValue";
import { MeterOscilloscope } from "./MeterOscilloscope";

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = {
  config: MeterChannelConfig;
  state: ChannelState;
  setRef: (m: MeterMode, k: keyof ChannelRefs, el: HTMLElement | SVGElement | null) => void;
  reducedMotion: boolean;
};

export const MeterChannel = memo(function MeterChannel({ config, state, setRef, reducedMotion }: Props) {
  const { zone, value } = state;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cardRef.current, {
        rotateY: x * 6,
        rotateX: -y * 6,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [reducedMotion],
  );

  const handleLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      data-meter-channel
      className="group/ch relative flex flex-col items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-white/[0.02] sm:p-5"
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[11px] transition-all group-hover/ch:scale-110"
            style={{
              backgroundColor: hexToRgba(zone.color, 0.1),
              color: zone.color,
              border: `1px solid ${hexToRgba(zone.color, 0.18)}`,
              boxShadow: `0 0 12px ${hexToRgba(zone.color, 0.08)}`,
              transition: "all 0.8s ease",
            }}
          >
            {config.icon}
          </span>
          <span className="text-[10px] font-medium tracking-[0.18em] text-white/20 transition-colors group-hover/ch:text-white/35">{config.label}</span>
        </div>

        <span
          className="h-1 w-1 rounded-full transition-all group-hover/ch:scale-150"
          style={{
            backgroundColor: zone.color,
            boxShadow: `0 0 6px ${hexToRgba(zone.color, 0.6)}`,
            transition: "all 0.8s ease",
          }}
        />
      </div>

      <div className="relative w-full" style={{ maxWidth: "clamp(150px, 20vw, 210px)" }}>
        <MeterArc config={config} zone={zone} value={value} setRef={setRef} />
        <div className="absolute inset-0 flex items-center justify-center pt-1">
          <MeterValue config={config} value={value} zone={zone} setRef={setRef} />
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg px-1">
        <MeterOscilloscope
          color={zone.color}
          speed={config.wave.speed}
          complexity={config.wave.complexity}
          amplitude={config.wave.amplitude}
          reducedMotion={reducedMotion}
        />
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1 transition-all group-hover/ch:px-4"
        style={{
          backgroundColor: hexToRgba(zone.color, 0.06),
          border: `1px solid ${hexToRgba(zone.color, 0.12)}`,
          transition: "all 0.8s ease",
        }}
      >
        <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: zone.color, transition: "background-color 0.8s ease" }} />
        <span
          ref={(el) => setRef(config.mode, "labelEl", el)}
          className="text-[9px] font-semibold tracking-[0.12em]"
          style={{ color: zone.color, transition: "color 0.8s ease" }}
        >
          {zone.label}
        </span>
      </div>
    </div>
  );
});
