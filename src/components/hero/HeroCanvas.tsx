"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

let webglSupport: boolean | null = null;

function supportsWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const subscribe = () => () => {};

export function HeroCanvas() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const webgl = useSyncExternalStore(subscribe, supportsWebGL, () => false);

  return (
    <div aria-hidden className="absolute inset-0">
      <div className="hero-fallback absolute inset-0" />
      {webgl && !reduceMotion && <HeroScene />}
    </div>
  );
}
