"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Match } from "@/lib/detection";

const WIDTH = 272;
const GAP = 8;

export function ProtectPopover({
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
  const spaceBelow = window.innerHeight - rect.top - rect.height;
  const placeAbove = spaceBelow < 180;

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
          className="fixed z-50 overflow-hidden rounded-[10px] border"
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

          <div className="relative px-3.5 pb-3 pt-3">
            <div className="mb-2.5 flex items-start gap-2.5">
              <span
                className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-[8px]"
                style={{ background: "var(--ios-red)" }}
              >
                <ShieldCheck size={14} color="#fff" strokeWidth={2.4} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
                  {match.categoryLabel} detected
                </p>
                <p className="mt-0.5 truncate text-[14px] font-medium" style={{ color: "var(--ios-label)" }}>
                  &ldquo;{match.text}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onProtect}
                className="flex-1 rounded-[7px] py-1.5 text-center text-[13px] font-semibold text-white transition-transform active:scale-[0.97]"
                style={{ background: "var(--ios-green)" }}
              >
                Protect
              </button>
              <button
                onClick={onDismiss}
                className="rounded-[7px] px-3 py-1.5 text-center text-[13px] font-medium transition-transform active:scale-[0.97]"
                style={{ color: "var(--ios-label-secondary)", background: "var(--ios-fill)" }}
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
