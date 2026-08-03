"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, Search } from "lucide-react";
import type { ReactNode } from "react";
import { AppleGlyph } from "./AppleGlyph";

interface MacBookFrameProps {
  children: ReactNode;
  appName?: string;
  /** Render children edge-to-edge with no desktop backdrop/padding — used for
   * the bare Desktop state where the child itself is the wallpaper. */
  fillScreen?: boolean;
  /** Rendered as a floating overlay near the bottom of the screen, like the
   * real macOS Dock — pass a <MacDock> here rather than positioning it yourself. */
  dock?: ReactNode;
  /** Floating widgets that live on the screen above all windows (e.g. the
   * DoubleCheck assistant bubble) — absolutely positioned by the widget itself. */
  overlay?: ReactNode;
  /** Notification Center content. When set, the menu-bar clock becomes a
   * button that toggles a panel sliding in from the right, like macOS. */
  notifications?: ReactNode;
}

export function MacBookFrame({ children, appName = "Finder", fillScreen = false, dock, overlay, notifications }: MacBookFrameProps) {
  const [dockVisible, setDockVisible] = useState(false);
  const [ncOpen, setNcOpen] = useState(false);

  return (
    <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
      <div className="relative overflow-hidden rounded-[14px] shadow-2xl">
        {/* Menu bar */}
        <div
          className="relative z-10 flex items-center justify-between px-4 py-[7px] text-[12.5px] font-medium text-white"
          style={{ background: "rgba(45,45,48,0.68)", backdropFilter: "blur(20px) saturate(180%)" }}
        >
          <div className="flex items-center gap-4">
            <AppleGlyph size={13} />
            <span className="font-semibold">{appName}</span>
            <span className="hidden gap-4 opacity-70 min-[700px]:flex">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Window</span>
              <span>Help</span>
            </span>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <Wifi size={12} strokeWidth={2.4} />
            <Search size={12} strokeWidth={2.4} />
            {notifications ? (
              <button
                onClick={() => setNcOpen((o) => !o)}
                className="rounded-[5px] px-1.5 py-0.5 transition-colors hover:bg-white/15"
                style={{ background: ncOpen ? "rgba(255,255,255,0.2)" : "transparent" }}
              >
                Fri Aug 1&nbsp;&nbsp;9:41 AM
              </button>
            ) : (
              <span>Fri Aug 1&nbsp;&nbsp;9:41 AM</span>
            )}
          </div>
        </div>

        {/* Screen content */}
        <div className="relative">
          <div
            className={fillScreen ? "h-full" : "flex items-start justify-center p-6"}
            style={{
              background: fillScreen ? undefined : "linear-gradient(160deg, #c7d3e0 0%, #9fb0c4 100%)",
              // 668 = the windowed screen area (620px window + 24px padding each
              // side), so the laptop silhouette stays the same size across stages.
              height: fillScreen ? "min(668px, calc(100dvh - 8rem))" : undefined,
            }}
          >
            {children}
          </div>
          {overlay}
          {/* Notification Center: click-away backdrop + panel from the right */}
          {notifications && ncOpen && (
            <div className="absolute inset-0 z-40" onClick={() => setNcOpen(false)} />
          )}
          <AnimatePresence>
            {notifications && ncOpen && (
              <motion.div
                key="notification-center"
                initial={{ x: 360, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 360, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className="absolute right-3 top-2 z-50 w-[330px]"
              >
                {notifications}
              </motion.div>
            )}
          </AnimatePresence>
          {dock && (
            <div
              className="absolute inset-y-0 right-0 z-30 flex items-center justify-end"
              style={{ width: 110 }}
              onMouseEnter={() => setDockVisible(true)}
              onMouseLeave={() => setDockVisible(false)}
            >
              <motion.div
                className="mr-3"
                initial={false}
                animate={{ x: dockVisible ? 0 : 90, opacity: dockVisible ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                {dock}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
