"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

type ScrollWordsProps = {
  text: string;
  className?: string;
};

export function ScrollWords({ text, className }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}
