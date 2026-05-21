"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useMotionConfig } from "../motion/config";

// Lazy-load: Three.js bundle won't ship to non-3D users.
const ParticleField = dynamic(() => import("./particle-field"), {
  ssr: false,
  loading: () => null,
});

export function HeroBackground({ accent }: { accent: string }) {
  const { three, animations } = useMotionConfig();
  const show = useMemo(() => {
    if (!three.enabled || three.hero === "none") return false;
    if (animations.intensity === "off") return false;
    if (typeof window === "undefined") return false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return false;

    // Skip on low-end devices
    const cores = navigator.hardwareConcurrency ?? 4;
    return cores >= 4;
  }, [three.enabled, three.hero, animations.intensity]);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 75%)",
      }}
    >
      {three.hero === "particles" && <ParticleField accent={accent} />}
    </div>
  );
}
