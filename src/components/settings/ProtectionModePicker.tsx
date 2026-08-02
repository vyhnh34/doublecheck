"use client";

import { Check, MousePointerClick, Zap } from "lucide-react";
import { useDoubleCheck, type ProtectionMode } from "@/context/DoubleCheckProvider";

const OPTIONS: { mode: ProtectionMode; title: string; description: string; icon: typeof Zap }[] = [
  {
    mode: "review",
    title: "Review each time",
    description: "Highlight what's detected. Tap to protect it.",
    icon: MousePointerClick,
  },
  {
    mode: "auto",
    title: "Auto-protect",
    description: "Protect detected info automatically as you type.",
    icon: Zap,
  },
];

export function ProtectionModePicker() {
  const { protectionMode, setProtectionMode } = useDoubleCheck();

  return (
    <div className="flex flex-col gap-2">
      {OPTIONS.map(({ mode, title, description, icon: Icon }) => {
        const selected = protectionMode === mode;
        return (
          <button
            key={mode}
            onClick={() => setProtectionMode(mode)}
            className="flex w-full items-start gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors"
            style={{
              borderColor: selected ? "var(--ios-blue)" : "var(--ios-separator)",
              background: selected ? "color-mix(in srgb, var(--ios-blue) 8%, var(--ios-card))" : "var(--ios-card)",
            }}
          >
            <span
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[9px]"
              style={{ background: selected ? "var(--ios-blue)" : "var(--ios-fill)" }}
            >
              <Icon size={16} color={selected ? "#fff" : "var(--ios-label-secondary)"} strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-medium" style={{ color: "var(--ios-label)" }}>
                {title}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
                {description}
              </span>
            </span>
            <span
              className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full"
              style={{ background: selected ? "var(--ios-blue)" : "transparent", border: selected ? "none" : "1.5px solid var(--ios-label-tertiary)" }}
            >
              {selected && <Check size={12} color="#fff" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
