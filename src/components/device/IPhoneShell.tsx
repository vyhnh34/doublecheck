"use client";

import { ChevronLeft, Signal, Wifi, BatteryFull } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import type { ReactNode } from "react";

interface IPhoneShellProps {
  title: string;
  onBack?: () => void;
  /** When set, the home indicator becomes a real swipe-up-to-exit gesture,
   * matching iOS — there is no "Back to Home" button, only this gesture. */
  onSwipeHome?: () => void;
  children: ReactNode;
  /** Render list content full-bleed with no top nav padding treatment tweaks. */
  scrollable?: boolean;
}

const DRAG_RANGE = 120;
const COMMIT_DISTANCE = 60;
const COMMIT_VELOCITY = 600;

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-2.5 pb-1 text-[15px] font-semibold" style={{ color: "var(--ios-label)" }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.4} />
        <Wifi size={15} strokeWidth={2.4} />
        <BatteryFull size={20} strokeWidth={2} />
      </div>
    </div>
  );
}

export function IPhoneShell({ title, onBack, onSwipeHome, children, scrollable = true }: IPhoneShellProps) {
  const dragY = useMotionValue(0);
  const contentScale = useTransform(dragY, [-DRAG_RANGE, 0], [0.86, 1]);
  const contentOpacity = useTransform(dragY, [-DRAG_RANGE, 0], [0.4, 1]);
  const contentY = useTransform(dragY, [-DRAG_RANGE, 0], [-18, 0]);
  const contentRadius = useTransform(dragY, [-DRAG_RANGE, 0], [30, 0]);

  const handleDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const committed = info.offset.y < -COMMIT_DISTANCE || info.velocity.y < -COMMIT_VELOCITY;
    if (committed && onSwipeHome) {
      animate(dragY, -DRAG_RANGE * 1.5, {
        type: "spring",
        stiffness: 320,
        damping: 30,
        onComplete: () => {
          onSwipeHome();
          dragY.set(0);
        },
      });
    } else {
      animate(dragY, 0, { type: "spring", stiffness: 420, damping: 34 });
    }
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[390px] min-[900px]:rounded-[54px] min-[900px]:border-[10px] min-[900px]:p-0 min-[900px]:shadow-2xl"
      style={{ borderColor: "#1a1a1a" }}
    >
      {/* Side buttons — decorative, matches a current-gen iPhone's silhouette */}
      <div className="absolute -left-[11px] top-[108px] hidden h-[28px] w-[3px] rounded-l-sm bg-[#0d0d0d] min-[900px]:block" />
      <div className="absolute -left-[11px] top-[152px] hidden h-[52px] w-[3px] rounded-l-sm bg-[#0d0d0d] min-[900px]:block" />
      <div className="absolute -left-[11px] top-[214px] hidden h-[52px] w-[3px] rounded-l-sm bg-[#0d0d0d] min-[900px]:block" />
      <div className="absolute -right-[11px] top-[170px] hidden h-[70px] w-[3px] rounded-r-sm bg-[#0d0d0d] min-[900px]:block" />

      <div
        className="relative flex h-[780px] w-full flex-col overflow-hidden min-[900px]:h-[844px] min-[900px]:rounded-[44px]"
        style={{ background: "var(--ios-background-secondary)" }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 top-[11px] z-20 h-[30px] w-[104px] -translate-x-1/2 rounded-full"
          style={{ background: "#000" }}
        />
        <StatusBar />

        <div
          className="relative flex items-center px-2 pb-2 pt-1"
          style={{ background: "var(--ios-background-secondary)" }}
        >
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-0.5 px-1.5 py-1 text-[17px] font-normal"
              style={{ color: "var(--ios-blue)" }}
            >
              <ChevronLeft size={22} strokeWidth={2.4} className="-ml-1" />
              Back
            </button>
          ) : (
            <div className="w-8" />
          )}
          <h1
            className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold"
            style={{ color: "var(--ios-label)" }}
          >
            {title}
          </h1>
        </div>

        <motion.div
          className={scrollable ? "flex-1 overflow-y-auto" : "flex-1 overflow-hidden"}
          style={{
            background: "var(--ios-background-secondary)",
            scale: onSwipeHome ? contentScale : 1,
            opacity: onSwipeHome ? contentOpacity : 1,
            y: onSwipeHome ? contentY : 0,
            borderRadius: onSwipeHome ? contentRadius : 0,
          }}
        >
          {children}
        </motion.div>

        {onSwipeHome ? (
          <motion.div
            drag="y"
            dragConstraints={{ top: -DRAG_RANGE, bottom: 0 }}
            dragElastic={0.2}
            style={{ y: dragY, background: "var(--ios-background-secondary)" }}
            onDragEnd={handleDragEnd}
            className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
          >
            <div className="h-[5px] w-[134px] rounded-full" style={{ background: "var(--ios-label)", opacity: 0.85 }} />
          </motion.div>
        ) : (
          <div className="flex justify-center py-2" style={{ background: "var(--ios-background-secondary)" }}>
            <div className="h-[5px] w-[134px] rounded-full" style={{ background: "var(--ios-label)", opacity: 0.85 }} />
          </div>
        )}
      </div>
    </div>
  );
}
