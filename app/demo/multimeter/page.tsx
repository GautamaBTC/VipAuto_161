"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MultimeterPremium = dynamic(() => import("@/components/multimeter-premium/Multimeter"), { ssr: false });

export default function MultimeterDemoPage() {
  const [v, setV] = useState(13.8);
  const [a, setA] = useState(2.4);
  const [r, setR] = useState(4700);

  return (
    <div className="min-h-dvh bg-[#06060a] pb-20 pt-12">
      <MultimeterPremium voltage={v} current={a} resistance={r} autoAnimate={false} />

      <div className="mx-auto mt-8 flex max-w-md flex-col gap-6 px-4">
        {[
          { label: "Voltage", value: v, set: setV, min: 0, max: 32, step: 0.1, unit: "V" },
          { label: "Current", value: a, set: setA, min: 0, max: 50, step: 0.1, unit: "A" },
          { label: "Resistance", value: r, set: setR, min: 0, max: 999999, step: 100, unit: "?" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-white/30">
              <span>{item.label}</span>
              <span className="font-mono">
                {item.value} {item.unit}
              </span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={item.value}
              onChange={(e) => item.set(Number(e.target.value))}
              className="w-full appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-2
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-runnable-track]:bg-white/10
                [&::-webkit-slider-thumb]:-mt-[7px]
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

