"use client";

import type { ReactNode } from "react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";

interface DeviceStageProps {
  mac: ReactNode;
  iphone: ReactNode;
}

/**
 * Renders both device chrome trees at once so the DeviceSwitcher toggle is an
 * instant CSS swap, not a remount — any lifted state on the page stays intact
 * because both `mac` and `iphone` are built from the same page-level state.
 */
export function DeviceStage({ mac, iphone }: DeviceStageProps) {
  const { deviceMode } = useDoubleCheck();

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden p-6">
      <div className={deviceMode === "mac" ? "block w-full" : "hidden"}>{mac}</div>
      <div className={deviceMode === "iphone" ? "block" : "hidden"}>{iphone}</div>
    </div>
  );
}
