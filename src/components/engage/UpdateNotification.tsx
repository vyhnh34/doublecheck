"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * The DoubleCheck "Software Update" notification as it appears in Notification
 * Center after the initial lock-screen moment — tap it to (re)enter the
 * onboarding flow.
 */
export function UpdateNotification({ onTap, variant }: { onTap: () => void; variant: "ios" | "mac" }) {
  return (
    <motion.div
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onTap();
      }}
      initial={{ opacity: 0, y: variant === "ios" ? -16 : -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: variant === "ios" ? -16 : -10, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="relative flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3.5 py-3 text-left backdrop-blur-2xl"
      style={{
        background: variant === "ios" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.85)",
        border: variant === "ios" ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
      }}
    >
      <span className="relative grid h-9 w-9 flex-shrink-0 place-items-center overflow-hidden rounded-[9px]">
        <Image src="/app-icons/settings.png" alt="Settings" width={36} height={36} draggable={false} className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-semibold" style={{ color: variant === "ios" ? "#fff" : "#000" }}>
            Software Update
          </span>
          <span className="text-[11px]" style={{ color: variant === "ios" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}>
            9:41 AM
          </span>
        </span>
        <span
          className="mt-0.5 block text-[13px] leading-snug"
          style={{ color: variant === "ios" ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.75)" }}
        >
          DoubleCheck is here. Tap to set up on-device privacy protection.
        </span>
      </span>
    </motion.div>
  );
}
