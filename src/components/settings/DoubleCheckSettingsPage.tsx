"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { ToggleSwitch } from "./ToggleSwitch";
import { ProtectionModePicker } from "./ProtectionModePicker";
import { CategoryAccordion } from "@/components/onboarding/CategoryAccordion";

export function DoubleCheckSettingsPage() {
  const { featureOn, setFeatureOn, orderedCategories } = useDoubleCheck();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="px-5 py-5">
      <h1 className="mb-4 px-1 text-[22px] font-bold" style={{ color: "var(--ios-label)" }}>
        DoubleCheck
      </h1>

      <div className="mb-2 overflow-hidden rounded-[var(--radius-ios-card)]" style={{ background: "var(--ios-card)" }}>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <span
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[9px]"
            style={{ background: "linear-gradient(135deg, #34c759, #248a3d)" }}
          >
            <ShieldCheck size={17} color="#fff" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium" style={{ color: "var(--ios-label)" }}>
              DoubleCheck
            </span>
            <span className="block text-[12.5px]" style={{ color: "var(--ios-label-secondary)" }}>
              Protect sensitive info as you type
            </span>
          </span>
          <ToggleSwitch on={featureOn} onToggle={() => setFeatureOn(!featureOn)} />
        </div>
      </div>
      <p className="mb-6 px-2 text-[12.5px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
        {featureOn
          ? "Detected terms are highlighted as you type, everywhere on this device."
          : "Detection is paused. Nothing will be highlighted or offered for protection until you turn this back on."}
      </p>

      <AnimatePresence initial={false}>
        {featureOn && (
          <motion.div
            key="protection-settings"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <h2 className="mb-1.5 px-2 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
              Protection mode
            </h2>
            <div className="mb-6">
              <ProtectionModePicker />
            </div>

            <h2 className="mb-1.5 px-2 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
              Protect
            </h2>
            <CategoryAccordion categories={orderedCategories} expanded={expanded} onToggleExpand={toggleExpand} />
            <p className="mt-1.5 px-2 pb-1 text-[12.5px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
              Changes here apply immediately, everywhere DoubleCheck runs.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
