import type { ReactNode } from "react";

export function SettingsIcon({ icon, bg, size = 30 }: { icon: ReactNode; bg: string; size?: number }) {
  return (
    <span
      className="grid flex-shrink-0 place-items-center text-white"
      style={{ width: size, height: size, background: bg, borderRadius: size * 0.22 }}
    >
      {icon}
    </span>
  );
}
