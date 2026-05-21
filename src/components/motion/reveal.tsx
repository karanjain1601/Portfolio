"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMotionConfig } from "./config";

const intensityMap = {
  off:    { y: 0,  duration: 0 },
  low:    { y: 4,  duration: 0.4 },
  medium: { y: 12, duration: 0.55 },
  high:   { y: 24, duration: 0.7 },
} as const;

function useEffectiveCfg() {
  const { animations } = useMotionConfig();
  const reduced = useReducedMotion();
  if (reduced || animations.intensity === "off") {
    return { y: 0, duration: 0 };
  }
  return intensityMap[animations.intensity] ?? intensityMap.medium;
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const cfg = useEffectiveCfg();
  const variants: Variants = {
    hidden: { opacity: cfg.duration === 0 ? 1 : 0, y: cfg.y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: cfg.duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  const cfg = useEffectiveCfg();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: cfg.duration === 0 ? 0 : gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const cfg = useEffectiveCfg();
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: cfg.duration === 0 ? 1 : 0, y: cfg.y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: cfg.duration, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
