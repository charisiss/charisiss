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
};

export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  amount = 12,
  priority,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute -inset-y-[15%] inset-x-0" style={{ y }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
