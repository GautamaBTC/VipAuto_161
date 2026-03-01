"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type InViewOptions = {
  threshold?: number;
  once?: boolean;
};

export function useInView(options: InViewOptions = {}): [RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0.2, once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
