"use client";

import { memo } from "react";

export const MeterNoise = memo(function MeterNoise() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden>
      <filter id="mm-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#mm-noise)" />
    </svg>
  );
});
