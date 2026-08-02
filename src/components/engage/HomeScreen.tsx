"use client";

import { Search } from "lucide-react";
import { APPS } from "@/data/apps";
import { AppIcon, DOCK_IDS } from "./appIcons";

export function HomeScreen({ onOpenApp, enabledIds }: { onOpenApp: (id: string) => void; enabledIds: string[] }) {
  const gridApps = APPS.filter((a) => !DOCK_IDS.includes(a.id));

  return (
    <div
      className="flex h-full flex-col px-5 pb-3 pt-14"
      style={{ background: "linear-gradient(160deg, #4c6a92 0%, #26374f 55%, #131c2b 100%)" }}
    >
      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {gridApps.map((app) => {
          const enabled = enabledIds.includes(app.id);
          return (
            <button
              key={app.id}
              onClick={() => enabled && onOpenApp(app.id)}
              disabled={!enabled}
              className="flex flex-col items-center gap-1.5 transition-transform active:scale-90 disabled:opacity-45"
            >
              <AppIcon appId={app.id} />
              <span className="text-[11.5px] font-medium text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                {app.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="mb-3 flex justify-center">
        <span
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px]"
          style={{ background: "rgba(120,120,128,0.32)", color: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)" }}
        >
          <Search size={14} strokeWidth={2.4} />
          Search
        </span>
      </div>

      <div
        className="flex items-center justify-around rounded-[28px] px-3 py-2.5"
        style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        {DOCK_IDS.map((id) => {
          const enabled = enabledIds.includes(id);
          return (
            <button
              key={id}
              onClick={() => enabled && onOpenApp(id)}
              disabled={!enabled}
              className="transition-transform active:scale-90 disabled:opacity-45"
            >
              <AppIcon appId={id} size={54} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
