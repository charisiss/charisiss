"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { site } from "@/lib/content";

const SESSION_KEY = "charisiss:preloaded";
const ease = [0.76, 0, 0.24, 1] as const;

const IntroContext = createContext(true);

/** True once the intro has finished (always true outside the home page). */
export function useIntroReady() {
  return useContext(IntroContext);
}

const subscribe = () => () => {};

function shouldSkipIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const skip = useSyncExternalStore(subscribe, shouldSkipIntro, () => false);
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const ready = skip || done;

  useEffect(() => {
    if (skip) return;
    const controls = animate(count, 100, {
      duration: 1.2,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [count, skip]);

  return (
    <IntroContext.Provider value={ready}>
      {children}
      {!skip && (
        <AnimatePresence onExitComplete={markIntroSeen}>
          {!done && <PreloaderOverlay key="preloader" label={label} />}
        </AnimatePresence>
      )}
      <noscript>
        <style>{".preloader{display:none}"}</style>
      </noscript>
    </IntroContext.Provider>
  );
}

function PreloaderOverlay({ label }: { label: MotionValue<string> }) {
  return (
    <div className="preloader fixed inset-0 z-[100]" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-accent"
        style={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease, delay: 0.15 }}
      />
      <motion.div
        className="absolute inset-0 flex flex-col justify-between bg-background p-6 md:p-10"
        style={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="flex items-center justify-between text-xs tracking-[0.24em] text-muted">
          <span>PORTFOLIO</span>
          <span>{site.tagline}</span>
        </div>
        <div className="overflow-hidden">
          <motion.p
            className="wordmark text-[12vw] leading-none text-foreground md:text-[8vw]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {site.name}
          </motion.p>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-xs tracking-[0.24em] text-muted">Loading experience</span>
          <motion.span className="font-display text-5xl tabular-nums text-accent md:text-7xl">
            {label}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
