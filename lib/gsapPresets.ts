import { gsap } from "gsap";

export function runRevealAnimation(target: Element): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: 22 },
    { autoAlpha: 1, y: 0, duration: 0.72, ease: "power2.out", overwrite: true },
  );
}
