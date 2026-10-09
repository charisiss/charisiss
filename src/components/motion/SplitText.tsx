"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type SplitTextProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Controls playback externally; when omitted the text animates once on entering the viewport. */
  play?: boolean;
};

export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  play,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const active = play ?? inView;
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom"
        >
          <motion.span
            className={`inline-block ${wordClassName ?? ""}`}
            initial={{ y: "110%" }}
            animate={active ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00a0"}
        </span>
      ))}
    </span>
  );
}
