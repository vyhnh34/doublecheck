"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, Smartphone, Laptop } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-tertiary)" }}>
      {children}
    </p>
  );
}

/**
 * A single control panel for everything that switches how the prototype is
 * previewed — currently just Device, but built so a teammate can drop in more
 * sections (a version picker, a theme toggle, etc.) as the prototype grows,
 * without inventing a new floating-button pattern each time.
 */
export function VersionSwitcher() {
  const [open, setOpen] = useState(false);
  const { deviceMode, setDeviceMode } = useDoubleCheck();

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Prototype controls"
        className="fixed bottom-4 left-4 z-50 grid h-11 w-11 place-items-center rounded-full border shadow-lg backdrop-blur-xl transition-transform active:scale-95"
        style={{
          background: "color-mix(in srgb, var(--ios-card) 90%, transparent)",
          borderColor: "var(--ios-separator)",
          color: "var(--ios-label-secondary)",
        }}
      >
        <Settings size={18} strokeWidth={2.2} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="fixed bottom-[70px] left-4 z-50 w-[220px] rounded-[16px] border p-3 shadow-2xl"
              style={{ background: "var(--ios-card)", borderColor: "var(--ios-separator)" }}
            >
              <SectionLabel>Device</SectionLabel>
              <div
                className="flex items-center gap-1 rounded-full p-1"
                style={{ background: "var(--ios-fill)" }}
              >
                <button
                  onClick={() => setDeviceMode("iphone")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: deviceMode === "iphone" ? "var(--ios-card)" : "transparent",
                    color: deviceMode === "iphone" ? "var(--ios-label)" : "var(--ios-label-secondary)",
                    boxShadow: deviceMode === "iphone" ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                    fontWeight: deviceMode === "iphone" ? 600 : 500,
                  }}
                >
                  <Smartphone size={14} strokeWidth={2.2} />
                  iPhone
                </button>
                <button
                  onClick={() => setDeviceMode("mac")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: deviceMode === "mac" ? "var(--ios-card)" : "transparent",
                    color: deviceMode === "mac" ? "var(--ios-label)" : "var(--ios-label-secondary)",
                    boxShadow: deviceMode === "mac" ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                    fontWeight: deviceMode === "mac" ? 600 : 500,
                  }}
                >
                  <Laptop size={14} strokeWidth={2.2} />
                  Mac
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
