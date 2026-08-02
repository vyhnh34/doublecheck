"use client";

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
}

export function MacBookFrame({ children, appName = "Finder", fillScreen = false, dock }: MacBookFrameProps) {
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
            <span>Fri Aug 1&nbsp;&nbsp;9:41 AM</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="relative">
          <div
            className={fillScreen ? "" : "flex items-start justify-center p-6"}
            style={{ background: fillScreen ? undefined : "linear-gradient(160deg, #c7d3e0 0%, #9fb0c4 100%)" }}
          >
            {children}
          </div>
          {dock && <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center">{dock}</div>}
        </div>
      </div>
    </div>
  );
}
