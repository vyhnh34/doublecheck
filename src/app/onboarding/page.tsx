"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Undo2 } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";
import { DeviceStage } from "@/components/device/DeviceStage";
import { VersionSwitcher } from "@/components/device/VersionSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { CategoryAccordion, InfoNote } from "@/components/onboarding/CategoryAccordion";
import { AutoProtectKeyboardPreview } from "@/components/onboarding/AutoProtectKeyboardPreview";
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
                className="rounded-[3px] px-0.5"
                style={{
                  background: "rgba(52,199,89,0.16)",
                  boxShadow: "inset 0 -1.5px 0 var(--ios-green)",
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: "13px",
                }}
              >
                x7Kq
              </span>{" "}
              and I live in{" "}
              <span
                className="rounded-[3px] px-0.5"
                style={{
                  background: "rgba(52,199,89,0.16)",
                  boxShadow: "inset 0 -1.5px 0 var(--ios-green)",
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: "13px",
                }}
              >
                q3v#L9z
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

/** A live miniature of the real review-mode flow: tap the red highlight, then
 * hit the DoubleCheck button in the popover to secure it — same visuals and
 * steps as DetectedPopover/SecuredPopover in the actual prototype. */
function ReviewTapPreview() {
  const [secured, setSecured] = useState(false);
  const [popover, setPopover] = useState<null | "detected" | "secured">(null);

  return (
    <div
      className="relative w-full max-w-[320px] overflow-visible rounded-[16px] px-4 py-3.5 text-left"
      style={{ background: "var(--ios-fill)" }}
    >
      {popover && <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />}

      <div className="text-[14.5px] leading-relaxed" style={{ color: "var(--ios-label)" }}>
        Call me at{" "}
        <span className="relative inline-block">
          <motion.button
            onClick={() => setPopover(secured ? "secured" : "detected")}
            animate={secured || popover ? { scale: 1 } : { scale: [1, 1.05, 1] }}
            transition={
              secured || popover ? { duration: 0.15 } : { duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }
            }
            className="inline-block cursor-pointer rounded-[3px] px-0.5"
            style={{
              font: "inherit",
              color: "var(--ios-label)",
              background: secured ? "rgba(52,199,89,0.16)" : "rgba(255,59,48,0.16)",
              boxShadow: secured ? "inset 0 -1.5px 0 var(--ios-green)" : "inset 0 -1.5px 0 var(--ios-red)",
              transition: "background 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            206-555-0117
          </motion.button>

          <AnimatePresence>
            {popover && (
              <motion.div
                key={popover}
                initial={{ opacity: 0, scale: 0.94, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute left-1/2 top-full z-50 mt-2 flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] border px-3 py-2"
                style={{
                  width: 150,
                  background: "var(--ios-card)",
                  borderColor: "var(--ios-separator)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45"
                  style={{
                    background: "var(--ios-card)",
                    borderLeft: "1px solid var(--ios-separator)",
                    borderTop: "1px solid var(--ios-separator)",
                  }}
                />
                {popover === "detected" ? (
                  <>
                    <span className="flex-1 truncate text-[14px] font-medium" style={{ color: "var(--ios-label)" }}>
                      Phone number
                    </span>
                    <button
                      onClick={() => {
                        setSecured(true);
                        setPopover(null);
                      }}
                      aria-label="Protect"
                      className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full transition-transform active:scale-90"
                      style={{ background: "linear-gradient(135deg, #8e8e93, #48484a)" }}
                    >
                      <DoubleCheckMark size={13} className="text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate text-[14px] font-medium" style={{ color: "var(--ios-label)" }}>
                      Secured
                    </span>
                    <button
                      onClick={() => {
                        setSecured(false);
                        setPopover(null);
                      }}
                      aria-label="Undo"
                      className="flex-shrink-0 transition-transform active:scale-90"
                    >
                      <Undo2 size={16} strokeWidth={2.2} style={{ color: "var(--ios-label-secondary)" }} />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </span>{" "}
        tomorrow.
      </div>

      {!secured && !popover && (
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
          className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
          style={{ background: "#1c1c1e" }}
        >
          Tap to protect
        </motion.div>
      )}
    </div>
  );
}

function Step3LiveExplainer() {
  const { protectionMode } = useDoubleCheck();

  return (
    <div className="flex flex-col items-center px-6 pt-8 text-center">
      <h1 className="text-[22px] font-bold" style={{ color: "var(--ios-label)" }}>
        Here&apos;s what happens live
      </h1>
      <p className="mt-2 max-w-[300px] text-[15px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
        {protectionMode === "review"
          ? "Tap a highlight to protect it."
          : "Protects quietly as you type."}
      </p>

      <div className="mt-7 flex w-full justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={protectionMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex w-full justify-center"
          >
            {protectionMode === "review" ? <ReviewTapPreview /> : <AutoProtectKeyboardPreview />}
          </motion.div>
        </AnimatePresence>
      </div>

      <InfoNote>Everything is scanned on-device.</InfoNote>

      <div className="mt-6 w-full max-w-[320px] text-left">
        <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ios-label-secondary)" }}>
          How should it protect you?
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
      <VersionSwitcher />
      <DeviceStage
        mac={
          <MacWindow windowTitle="DoubleCheck Setup" onBack={handleBack} onClose={() => router.push("/engage")}>
            {content}
          </MacWindow>
        }
        iphone={
          <IPhoneShell title="DoubleCheck" onBack={handleBack} onSwipeHome={() => router.push("/engage")}>
            {content}
          </IPhoneShell>
        }
      />
    </main>
  );
}
