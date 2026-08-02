"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Match } from "@/lib/detection";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";

const WIDTH = 150;
const GAP = 8;

/** Small anchored tooltip prompting to protect a newly detected match — the
 * minimal counterpart to SecuredPopover. Used on both iPhone and Mac. */
export function DetectedPopover({
  match,
  rect,
  onProtect,
  onDismiss,
}: {
  match: Match | null;
  rect: { top: number; left: number; width: number; height: number } | null;
  onProtect: () => void;
  onDismiss: () => void;
}) {
  if (!match || !rect) return null;

  const anchorX = rect.left + rect.width / 2;
  const placeAbove = rect.top > 70;

  const left = Math.min(Math.max(anchorX - WIDTH / 2, 12), window.innerWidth - WIDTH - 12);
  const top = placeAbove ? rect.top - GAP : rect.top + rect.height + GAP;
  const arrowLeft = Math.min(Math.max(anchorX - left, 16), WIDTH - 16);

  return (
    <AnimatePresence>
      <>
        <div className="fixed inset-0 z-40" onClick={onDismiss} />
        <motion.div
          key={`${match.start}-${match.end}`}
          initial={{ opacity: 0, scale: 0.94, y: placeAbove ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          className="fixed z-50 flex items-center gap-2.5 overflow-hidden rounded-[10px] border px-3 py-2"
          style={{
            width: WIDTH,
            left,
            top: placeAbove ? undefined : top,
            bottom: placeAbove ? window.innerHeight - top : undefined,
            background: "var(--ios-card)",
            borderColor: "var(--ios-separator)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="absolute h-2.5 w-2.5 rotate-45"
            style={{
              left: arrowLeft - 5,
              top: placeAbove ? undefined : -5,
              bottom: placeAbove ? -5 : undefined,
              background: "var(--ios-card)",
              borderLeft: placeAbove ? "none" : "1px solid var(--ios-separator)",
              borderTop: placeAbove ? "none" : "1px solid var(--ios-separator)",
              borderRight: placeAbove ? "1px solid var(--ios-separator)" : "none",
              borderBottom: placeAbove ? "1px solid var(--ios-separator)" : "none",
            }}
          />

          <span className="flex-1 truncate text-[14px] font-medium" style={{ color: "var(--ios-label)" }}>
            {match.subItemLabel}
          </span>
          <button
            onClick={onProtect}
            aria-label="Protect"
            className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full transition-transform active:scale-90"
            style={{ background: "linear-gradient(135deg, #8e8e93, #48484a)" }}
          >
            <DoubleCheckMark size={13} className="text-white" />
          </button>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
