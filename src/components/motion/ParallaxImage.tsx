"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  amount?: number;
  priority?: boolean;
  objectPosition?: string;
};

export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  amount = 12,
  priority,
  objectPosition = "top",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const bleed = amount > 0 ? Math.max(amount + 4, 8) : 0;
  const pinTop = objectPosition === "top" || objectPosition.startsWith("top");

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute inset-x-0"
        style={{
          y,
          top: pinTop ? 0 : `-${bleed}%`,
          bottom: pinTop ? `-${bleed * 2}%` : `-${bleed}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
    </div>
  );
}
