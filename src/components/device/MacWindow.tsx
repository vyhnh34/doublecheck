"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { MacBookFrame } from "./MacBookFrame";

export interface MacSidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
  active?: boolean;
  onClick?: () => void;
}

interface MacWindowProps {
  windowTitle: string;
  sidebarItems?: MacSidebarItem[];
  onBack?: () => void;
  /** Called when the red traffic-light dot is clicked — closes this window
   * back to the Desktop, matching real macOS. */
  onClose?: () => void;
  children: ReactNode;
  /** Rendered inside the laptop frame's screen area, overlaying the bottom —
   * pass a <MacDock> for routes that need the persistent app switcher. */
  dock?: ReactNode;
  /** Floating screen-level widgets, passed through to the laptop frame. */
  overlay?: ReactNode;
  /** Notification Center content, passed through to the laptop frame. */
  notifications?: ReactNode;
}

export function MacWindow({ windowTitle, sidebarItems, onBack, onClose, children, dock, overlay, notifications }: MacWindowProps) {
  return (
    <MacBookFrame appName={windowTitle} dock={dock} overlay={overlay} notifications={notifications}>
      <div
        className="flex w-full max-w-[880px] flex-col overflow-hidden rounded-[10px] border shadow-2xl"
        style={{ borderColor: "var(--mac-separator)", height: 620 }}
      >
        {/* Title bar */}
        <div
          className="relative flex h-[52px] flex-shrink-0 items-center px-4"
          style={{ background: "var(--mac-sidebar-bg)", borderBottom: "1px solid var(--mac-separator)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={!onClose}
              aria-label="Close"
              className="h-3 w-3 rounded-full disabled:cursor-default"
              style={{ background: "var(--mac-red)" }}
            />
            <span className="h-3 w-3 rounded-full" style={{ background: "var(--mac-yellow)" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "var(--mac-green)" }} />
          </div>

          <div className="ml-5 flex items-center gap-1">
            <button
              onClick={onBack}
              disabled={!onBack}
              className="grid h-6 w-6 place-items-center rounded disabled:opacity-30"
              style={{ color: "var(--mac-label-secondary)" }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              disabled
              className="grid h-6 w-6 place-items-center rounded opacity-30"
              style={{ color: "var(--mac-label-secondary)" }}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          <h1
            className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold"
            style={{ color: "var(--mac-label)" }}
          >
            {windowTitle}
          </h1>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {sidebarItems && (
            <div
              className="w-[220px] flex-shrink-0 overflow-y-auto px-2.5 py-3"
              style={{ background: "var(--mac-sidebar-bg)", borderRight: "1px solid var(--mac-separator)" }}
            >
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="mb-0.5 flex w-full items-center gap-2.5 rounded-[7px] px-2 py-[7px] text-left text-[13px]"
                  style={{
                    background: item.active ? "var(--ios-blue)" : "transparent",
                    color: item.active ? "#fff" : "var(--mac-label)",
                    fontWeight: item.active ? 500 : 400,
                  }}
                >
                  <span
                    className="grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded-[6px] text-white"
                    style={{ background: item.iconBg }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto" style={{ background: "var(--mac-detail-bg)" }}>
            {children}
          </div>
        </div>
      </div>
    </MacBookFrame>
  );
}
