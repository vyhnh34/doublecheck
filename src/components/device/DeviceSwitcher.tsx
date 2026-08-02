"use client";

import { Smartphone, Laptop } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";

export function DeviceSwitcher() {
  const { deviceMode, setDeviceMode } = useDoubleCheck();

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border p-1 shadow-lg backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--ios-card) 85%, transparent)",
        borderColor: "var(--ios-separator)",
      }}
    >
      <button
        onClick={() => setDeviceMode("iphone")}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
        style={{
          background: deviceMode === "iphone" ? "var(--ios-blue)" : "transparent",
          color: deviceMode === "iphone" ? "#fff" : "var(--ios-label-secondary)",
        }}
      >
        <Smartphone size={14} strokeWidth={2.2} />
        iPhone
      </button>
      <button
        onClick={() => setDeviceMode("mac")}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
        style={{
          background: deviceMode === "mac" ? "var(--ios-blue)" : "transparent",
          color: deviceMode === "mac" ? "#fff" : "var(--ios-label-secondary)",
        }}
      >
        <Laptop size={14} strokeWidth={2.2} />
        Mac
      </button>
    </div>
  );
}
