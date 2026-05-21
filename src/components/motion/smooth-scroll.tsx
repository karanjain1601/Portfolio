"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionConfig } from "./config";

export function SmoothScroll() {
  const { animations } = useMotionConfig();

  useEffect(() => {
    if (!animations.smoothScroll) return;

    // Respect reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [animations.smoothScroll]);

  return null;
}
