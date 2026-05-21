"use client";

import { createContext, useContext } from "react";
import type { ThemeT } from "@/config/schema";

type MotionCfg = ThemeT["animations"];
type ThreeCfg = ThemeT["three"];

const Ctx = createContext<{ animations: MotionCfg; three: ThreeCfg }>({
  animations: { intensity: "medium", smoothScroll: true, cursor: "default" },
  three: { enabled: false, hero: "none" },
});

export function MotionConfigProvider({
  animations,
  three,
  children,
}: {
  animations: MotionCfg;
  three: ThreeCfg;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ animations, three }}>{children}</Ctx.Provider>;
}

export const useMotionConfig = () => useContext(Ctx);
