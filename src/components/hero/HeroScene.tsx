"use client";

import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { WaveField } from "./WaveField";

export default function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { margin: "0px 0px 0px 0px" });
  const compact = useMediaQuery("(max-width: 767px)");
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 1.7, 5.5], fov: 55, near: 0.1, far: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => setLoaded(true)}
      >
        {compact ? <WaveField columns={90} rows={45} /> : <WaveField columns={170} rows={72} />}
      </Canvas>
    </div>
  );
}
