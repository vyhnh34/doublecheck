"use client";

import { AppIcon, DOCK_IDS } from "@/components/engage/appIcons";

const MAC_DOCK_IDS = [...DOCK_IDS, "settings"];

/**
 * A real macOS Dock is system-level chrome, not part of any app's window —
 * it's always on screen, and clicking an icon switches straight to that app
 * with no "go home first" detour. Positioning is handled by whoever renders
 * this (see MacBookFrame's `dock` slot), so it stays anchored to the screen
 * area rather than the browser viewport.
 */
export function MacDock({ activeId, onOpenApp }: { activeId: string; onOpenApp: (id: string) => void }) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-[20px] px-2 py-3"
      style={{
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(28px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      {MAC_DOCK_IDS.map((id) => (
        <button
          key={id}
          onClick={() => onOpenApp(id)}
          className="relative flex items-center transition-transform hover:-translate-x-1.5 active:scale-95"
        >
          <span
            className="absolute -left-1.5 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full"
            style={{ background: activeId === id ? "#3c3c3c" : "transparent" }}
          />
          <AppIcon appId={id} size={48} />
        </button>
      ))}
    </div>
  );
}
