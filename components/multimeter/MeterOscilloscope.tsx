"use client";

import { memo, useEffect, useRef } from "react";

type Props = {
  color: string;
  speed: number;
  complexity: number;
  amplitude: number;
  reducedMotion: boolean;
};

export const MeterOscilloscope = memo(function MeterOscilloscope({
  color,
  speed,
  complexity,
  amplitude,
  reducedMotion,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef(0);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reducedMotion) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mid = h / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(0, mid);
      for (let i = 0; i <= w; i += 1) {
        const y = mid + Math.sin(i * 0.03) * amplitude * h * 0.3;
        ctx.lineTo(i, y);
      }
      ctx.strokeStyle = colorRef.current;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.stroke();

      return () => {
        ro.disconnect();
      };
    }

    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mid = h / 2;

      phaseRef.current += 0.018 * speed;
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      const c = colorRef.current;
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.1, c);
      grad.addColorStop(0.9, c);
      grad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.moveTo(0, mid);
      const points = Math.max(2, Math.ceil(w / 2));

      for (let i = 0; i <= points; i += 1) {
        const t = i / points;
        const x = t * w;

        let y = 0;
        for (let hIdx = 1; hIdx <= complexity; hIdx += 1) {
          const freq = 0.08 * hIdx + (hIdx % 2 === 0 ? 0.02 : -0.01);
          const amp = (amplitude * (h * 0.25)) / hIdx;
          const sp = phaseRef.current * (1 + hIdx * 0.3);
          y += Math.sin(sp + i * freq) * amp;
        }

        y += (Math.random() - 0.5) * 1.5 * amplitude;
        ctx.lineTo(x, mid + y);
      }

      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1.2;
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.strokeStyle = c;
      ctx.globalAlpha = 0.04;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [speed, complexity, amplitude, reducedMotion]);

  return <canvas ref={canvasRef} className="h-7 w-full" style={{ imageRendering: "auto" }} aria-hidden />;
});
