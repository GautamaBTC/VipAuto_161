"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TypeWriterProps = {
  words: string[];
};

export function TypeWriter({ words }: TypeWriterProps) {
  const reduced = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = words[wordIndex] ?? "";
    const timeout = setTimeout(
      () => {
        if (!deleting && charIndex < word.length) {
          setCharIndex((prev) => prev + 1);
          return;
        }
        if (!deleting && charIndex === word.length) {
          setDeleting(true);
          return;
        }
        if (deleting && charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          return;
        }
        if (deleting && charIndex === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      },
      deleting ? 40 : 70,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, reduced]);

  const current = reduced ? words[0] ?? "" : (words[wordIndex] ?? "").slice(0, charIndex);

  return <span className="font-mono text-[var(--accent-2)]">{current}</span>;
}
