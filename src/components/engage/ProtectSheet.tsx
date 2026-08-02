"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Match } from "@/lib/detection";

export function ProtectSheet({
  match,
  onProtect,
  onDismiss,
}: {
  match: Match | null;
  onProtect: () => void;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {match && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onDismiss}
            className="absolute inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.22, duration: 0.32 }}
            className="absolute inset-x-0 bottom-0 z-50 px-4 pb-6 pt-2.5 backdrop-blur-xl"
            style={{
              background: "color-mix(in srgb, var(--ios-card) 92%, transparent)",
              borderTopLeftRadius: "var(--radius-ios-sheet)",
              borderTopRightRadius: "var(--radius-ios-sheet)",
              boxShadow: "0 -8px 30px rgba(0,0,0,0.18)",
            }}
          >
            <div className="mx-auto mb-4 h-[4px] w-9 rounded-full" style={{ background: "var(--ios-fill)" }} />

            <div className="flex items-start gap-3 px-1">
              <span
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                style={{ background: "var(--ios-red)" }}
              >
                <ShieldCheck size={20} color="#fff" strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
                  {match?.categoryLabel} detected
                </p>
                <p className="mt-0.5 text-[16px] font-medium" style={{ color: "var(--ios-label)" }}>
                  &ldquo;{match?.text}&rdquo;
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ios-label-secondary)" }}>
                  {match?.subItemLabel} could identify you.
                </p>
              </div>
            </div>

            <button
              onClick={onProtect}
              className="mt-5 w-full rounded-[13px] py-3.5 text-center text-[16px] font-semibold text-white transition-transform active:scale-[0.97]"
              style={{ background: "var(--ios-green)" }}
            >
              Protect
            </button>
            <button
              onClick={onDismiss}
              className="mt-2 w-full rounded-[13px] py-3 text-center text-[15px] font-medium transition-transform active:scale-[0.97]"
              style={{ color: "var(--ios-label-secondary)" }}
            >
              Not now
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
