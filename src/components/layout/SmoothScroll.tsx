"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {!reduceMotion && (
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -16 } }} />
      )}
      {children}
    </MotionConfig>
  );
}
