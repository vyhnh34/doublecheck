"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Signal, Wifi, BatteryFull, X, Lock } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DeviceStage } from "@/components/device/DeviceStage";
import { VersionSwitcher } from "@/components/device/VersionSwitcher";
import { useState } from "react";

function NotificationBanner({
  onTap,
  onDismiss,
  variant,
}: {
  onTap: () => void;
  onDismiss: () => void;
  variant: "ios" | "mac";
}) {
  return (
    <motion.div
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onTap();
      }}
      initial={{ opacity: 0, y: variant === "ios" ? -16 : -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3.5 py-3 text-left backdrop-blur-2xl"
      style={{
        background: variant === "ios" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.85)",
        border: variant === "ios" ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
      }}
    >
      <span className="relative grid h-9 w-9 flex-shrink-0 place-items-center overflow-hidden rounded-[9px]">
        <Image src="/app-icons/settings.png" alt="Settings" width={36} height={36} className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span
            className="text-[13px] font-semibold"
            style={{ color: variant === "ios" ? "#fff" : "#000" }}
          >
            Software Update
          </span>
          <span
            className="text-[11px]"
            style={{ color: variant === "ios" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}
          >
            now
          </span>
        </span>
        <span
          className="mt-0.5 block text-[13px] leading-snug"
          style={{ color: variant === "ios" ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.75)" }}
        >
          DoubleCheck is here. Tap to set up on-device privacy protection.
        </span>
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: variant === "ios" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
          color: variant === "ios" ? "#fff" : "#000",
        }}
        aria-label="Dismiss"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

function IPhoneLockScreen({ onTap, onDismiss, dismissed }: { onTap: () => void; onDismiss: () => void; dismissed: boolean }) {
  return (
    <div
      className="mx-auto min-[900px]:rounded-[54px] min-[900px]:border-[10px] min-[900px]:shadow-2xl"
      style={{ borderColor: "#111", height: "min(844px, calc(100dvh - 3rem))", aspectRatio: "390 / 844" }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden min-[900px]:rounded-[44px]"
        style={{ background: "linear-gradient(160deg, #3a4a6b 0%, #1b2540 45%, #0c1220 100%)" }}
      >
        <div className="flex items-center justify-between px-7 pt-2.5 text-[15px] font-semibold text-white">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal size={15} strokeWidth={2.4} />
            <Wifi size={15} strokeWidth={2.4} />
            <BatteryFull size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="flex flex-col items-center pt-10 pb-6 text-white">
          <Lock size={16} strokeWidth={2.2} className="mb-3 opacity-80" />
          <div className="text-[68px] font-semibold leading-none tracking-tight">9:41</div>
          <div className="mt-2 text-[17px] font-medium opacity-90">Friday, August 1</div>
        </div>

        <div className="flex-1 px-3">
          {!dismissed && <NotificationBanner onTap={onTap} onDismiss={onDismiss} variant="ios" />}
        </div>

        <div className="flex justify-center py-2">
          <div className="h-[5px] w-[134px] rounded-full bg-white/85" />
        </div>
      </div>
    </div>
  );
}

function MacDesktop({ onTap, onDismiss, dismissed }: { onTap: () => void; onDismiss: () => void; dismissed: boolean }) {
  return (
    <div
      className="relative mx-auto flex h-[620px] w-full max-w-[880px] flex-col overflow-hidden rounded-[10px] border shadow-2xl"
      style={{
        borderColor: "var(--mac-separator)",
        background: "linear-gradient(160deg, #4c6a92 0%, #26374f 60%, #131c2b 100%)",
      }}
    >
      <div className="flex h-8 items-center justify-between px-4 text-[13px] font-medium text-white/90">
        <span />
        <span>Fri Aug 1 9:41 AM</span>
      </div>

      <div className="absolute right-4 top-10 w-[330px]">
        {!dismissed && <NotificationBanner onTap={onTap} onDismiss={onDismiss} variant="mac" />}
      </div>
    </div>
  );
}

export default function EnticePage() {
  const router = useRouter();
  const { setEnticeDismissedOnce } = useDoubleCheck();
  const [dismissed, setDismissed] = useState(false);

  const handleTap = () => router.push("/enter");
  const handleDismiss = () => {
    setDismissed(true);
    setEnticeDismissedOnce(true);
  };

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "#000" }}>
      <VersionSwitcher />
      <DeviceStage
        mac={<MacDesktop onTap={handleTap} onDismiss={handleDismiss} dismissed={dismissed} />}
        iphone={<IPhoneLockScreen onTap={handleTap} onDismiss={handleDismiss} dismissed={dismissed} />}
      />
    </main>
  );
}
