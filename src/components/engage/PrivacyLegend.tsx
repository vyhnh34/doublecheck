"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export function PrivacyLegend({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="mx-3 mb-2 overflow-hidden rounded-[12px] px-3 py-2.5"
      style={{ background: "var(--ios-fill)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: "var(--ios-label-secondary)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--ios-red)" }} />
            Detected — tap to protect it
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--ios-green)" }} />
            Protected — safe to send
          </span>
        </div>
        <button onClick={onDismiss} className="mt-0.5 flex-shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss legend">
          <X size={15} style={{ color: "var(--ios-label-secondary)" }} />
        </button>
      </div>
    </motion.div>
  );
}
