"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { SettingsIcon } from "@/components/icons/SettingsIcon";

export interface SettingsRowProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  showChevron?: boolean;
  trailing?: ReactNode;
  isNew?: boolean;
}

export function SettingsRow({
  icon,
  iconBg,
  title,
  subtitle,
  onClick,
  showChevron = true,
  trailing,
  isNew,
}: SettingsRowProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left disabled:cursor-default"
    >
      <SettingsIcon icon={icon} bg={iconBg} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[15px]" style={{ color: "var(--ios-label)" }}>
            {title}
          </span>
          {isNew && (
            <span
              className="rounded-[4px] px-1 py-[1px] text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ background: "var(--ios-blue)" }}
            >
              New
            </span>
          )}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[13px]" style={{ color: "var(--ios-label-secondary)" }}>
            {subtitle}
          </span>
        )}
      </span>
      {trailing}
      {showChevron && onClick && (
        <ChevronRight size={16} strokeWidth={2.4} style={{ color: "var(--ios-label-tertiary)" }} />
      )}
    </button>
  );
}
