"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

type CursorState = { label: string | null; hovering: boolean };

/**
 * Elements opt into the labelled state with `data-cursor="Label"`.
 * Any link or button gets the enlarged hover state.
 */
export function Cursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>({ label: null, hovering: false });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    }

    function onOver(event: PointerEvent) {
      updateTarget(event.target as HTMLElement | null);
    }

    function onScroll() {
      updateTarget(document.elementFromPoint(x.get(), y.get()) as HTMLElement | null);
    }

    function updateTarget(target: HTMLElement | null) {
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='button']");
      const label = labelled?.dataset.cursor ?? null;
      const hovering = Boolean(interactive);
      setState((prev) =>
        prev.label === label && prev.hovering === hovering ? prev : { label, hovering },
      );
    }

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 104 : state.hovering ? 44 : 10;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[11px] font-bold uppercase leading-tight tracking-[0.14em] text-background"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: state.hovering && !state.label ? "rgba(0,214,214,0.15)" : "rgba(0,214,214,1)",
          borderColor: "rgba(0,214,214,1)",
        }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.span
          className="px-3"
          animate={{ opacity: state.label ? 1 : 0, scale: state.label ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {state.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
