"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DeviceStage } from "@/components/device/DeviceStage";
import { DeviceSwitcher } from "@/components/device/DeviceSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { CategoryAccordion, InfoNote } from "@/components/onboarding/CategoryAccordion";
import { ProtectionModePicker } from "@/components/settings/ProtectionModePicker";

const TOTAL_STEPS = 3;

function StepDots({ step }: { step: number }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: i + 1 === step ? 20 : 6,
            background: i + 1 === step ? "var(--ios-blue)" : "var(--ios-fill)",
          }}
        />
      ))}
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[13px] py-3.5 text-center text-[16px] font-semibold text-white transition-transform active:scale-[0.97]"
      style={{ background: "var(--ios-blue)" }}
    >
      {children}
    </button>
  );
}

function Step1Explain() {
  const [phase, setPhase] = useState<"before" | "after">("before");

  useEffect(() => {
    const id = setInterval(() => {
      setPhase((p) => (p === "before" ? "after" : "before"));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center px-6 pt-8 text-center">
      <h1 className="text-[22px] font-bold" style={{ color: "var(--ios-label)" }}>
        Meet DoubleCheck
      </h1>
      <p className="mt-2 max-w-[300px] text-[15px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
        DoubleCheck watches what you type and offers to protect personal details before you send them.
      </p>

      <div
        className="relative mt-7 flex h-[92px] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-[16px] px-4"
        style={{ background: "var(--ios-fill)" }}
      >
        <AnimatePresence mode="wait">
          {phase === "before" ? (
            <motion.p
              key="before"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-[14.5px] leading-relaxed"
              style={{ color: "var(--ios-label)" }}
            >
              My name is{" "}
              <span
                className="rounded-[3px] px-0.5"
                style={{ background: "rgba(255,59,48,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-red)" }}
              >
                Alex
              </span>{" "}
              and I live in{" "}
              <span
                className="rounded-[3px] px-0.5"
                style={{ background: "rgba(255,59,48,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-red)" }}
              >
                Seattle
              </span>
              .
            </motion.p>
          ) : (
            <motion.p
              key="after"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-[14.5px] leading-relaxed"
              style={{ color: "var(--ios-label)" }}
            >
              My name is{" "}
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[12.5px] font-semibold text-white"
                style={{ background: "var(--ios-green)" }}
              >
                Protected
              </span>{" "}
              and I live in{" "}
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[12.5px] font-semibold text-white"
                style={{ background: "var(--ios-green)" }}
              >
                Protected
              </span>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 max-w-[300px] text-[12.5px] leading-snug" style={{ color: "var(--ios-label-tertiary)" }}>
        This is also called <em className="not-italic font-medium">anonymization</em>: swapping sensitive
        details for a placeholder before anything leaves your device.
      </p>
    </div>
  );
}

function Step3LiveExplainer() {
  return (
    <div className="flex flex-col items-center px-6 pt-8 text-center">
      <h1 className="text-[22px] font-bold" style={{ color: "var(--ios-label)" }}>
        Here&apos;s what happens live
      </h1>
      <p className="mt-2 max-w-[300px] text-[15px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
        Tap a highlight to protect it.
      </p>

      <div
        className="relative mt-7 w-full max-w-[320px] overflow-visible rounded-[16px] px-4 py-3.5 text-left"
        style={{ background: "var(--ios-fill)" }}
      >
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ios-label)" }}>
          Call me at{" "}
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
            className="relative inline-block rounded-[3px] px-0.5"
            style={{ background: "rgba(255,59,48,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-red)" }}
          >
            206-555-0117
          </motion.span>{" "}
          tomorrow.
        </p>

        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
          className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
          style={{ background: "#1c1c1e" }}
        >
          Tap to protect
        </motion.div>
      </div>

      <InfoNote>Everything is scanned on-device.</InfoNote>

      <div className="mt-6 w-full max-w-[320px] text-left">
        <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
          How should DoubleCheck protect you?
        </h2>
        <ProtectionModePicker />
      </div>
    </div>
  );
}

function OnboardingContent({
  step,
  expanded,
  onToggleExpand,
  onBack,
  onNext,
}: {
  step: number;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { orderedCategories } = useDoubleCheck();

  return (
    <div className="flex min-h-full flex-col px-4 pb-6 pt-2">
      <StepDots step={step} />

      <div className="flex-1">
        {step === 1 && <Step1Explain />}
        {step === 2 && (
          <div className="px-2">
            <h1 className="mb-1 px-1 text-[20px] font-bold" style={{ color: "var(--ios-label)" }}>
              What should DoubleCheck protect?
            </h1>
            <p className="mb-4 px-1 text-[13.5px]" style={{ color: "var(--ios-label-secondary)" }}>
              Choose the categories to watch for. You can change this anytime.
            </p>
            <CategoryAccordion categories={orderedCategories} expanded={expanded} onToggleExpand={onToggleExpand} />
          </div>
        )}
        {step === 3 && <Step3LiveExplainer />}
      </div>

      <div className="mt-6 px-2">
        <PrimaryButton onClick={onNext}>{step === TOTAL_STEPS ? "Get Started" : "Continue"}</PrimaryButton>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { setOnboardingComplete } = useDoubleCheck();
  const [step, setStep] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/enter");
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setOnboardingComplete(true);
      router.push("/engage");
    }
  };

  const content = (
    <OnboardingContent step={step} expanded={expanded} onToggleExpand={toggleExpand} onBack={handleBack} onNext={handleNext} />
  );

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <DeviceSwitcher />
      <DeviceStage
        mac={
          <MacWindow windowTitle="DoubleCheck Setup" onBack={handleBack}>
            {content}
          </MacWindow>
        }
        iphone={
          <IPhoneShell title="DoubleCheck" onBack={handleBack}>
            {content}
          </IPhoneShell>
        }
      />
    </main>
  );
}
