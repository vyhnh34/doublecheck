"use client";

import { motion } from "framer-motion";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";

/**
 * The laptop counterpart of the keyboard's DoubleCheck key: a resident
 * floating bubble on the Mac screen (Grammarly/Granola-style). Press and hold
 * to reveal what's been protected in the current draft.
 */
export function FloatingDoubleCheck({
  revealing,
  onRevealStart,
  onRevealEnd,
}: {
  revealing: boolean;
  onRevealStart: () => void;
  onRevealEnd: () => void;
}) {
  return (
    <motion.button
      aria-label="Hold to see what DoubleCheck protected"
      onPointerDown={(e) => {
        // Keep focus (and the caret) in the composer while holding.
        e.preventDefault();
        onRevealStart();
      }}
      onPointerUp={onRevealEnd}
      onPointerLeave={onRevealEnd}
      onPointerCancel={onRevealEnd}
      onContextMenu={(e) => e.preventDefault()}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: revealing
          ? "0 4px 14px rgba(0,0,0,0.3), 0 0 0 3px rgba(52,199,89,0.45)"
          : "0 4px 14px rgba(0,0,0,0.3), 0 0 0 0px rgba(52,199,89,0)",
      }}
      transition={{ duration: 0.15 }}
      // Styled after the iOS AssistiveTouch bubble: a small translucent dark
      // squircle that sits quietly over everything.
      className="absolute left-4 top-1/2 z-40 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-[11px] border backdrop-blur-md transition-transform active:scale-95"
      style={{
        background: revealing ? "var(--ios-green)" : "rgba(28,28,30,0.45)",
        borderColor: "rgba(255,255,255,0.18)",
        transition: "background 0.15s ease",
      }}
    >
      <DoubleCheckMark size={15} style={{ color: revealing ? "#fff" : "rgba(255,255,255,0.9)" }} />
    </motion.button>
  );
}
