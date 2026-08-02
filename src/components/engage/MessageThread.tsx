"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { detect, type Match } from "@/lib/detection";
import { ProtectableInput } from "./ProtectableInput";
import { ProtectSheet } from "./ProtectSheet";
import { PrivacyLegend } from "./PrivacyLegend";
import { HighlightedText } from "./HighlightedText";
import { useAutoProtect } from "./useAutoProtect";

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

interface MessageThreadProps {
  variant: "iphone" | "mac";
  accentColor: string;
  bubbleRadius?: number;
  messages: ThreadMessage[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  activeMatch: Match | null;
  onMatchClick: (match: Match, rect: DOMRect) => void;
  onProtect: () => void;
  onDismissSheet: () => void;
  onAutoProtect: (match: Match) => void;
  isTyping?: boolean;
  emptyStateText?: string;
}

export function MessageThread({
  variant,
  accentColor,
  bubbleRadius = 18,
  messages,
  draft,
  onDraftChange,
  onSend,
  activeMatch,
  onMatchClick,
  onProtect,
  onDismissSheet,
  onAutoProtect,
  isTyping,
  emptyStateText,
}: MessageThreadProps) {
  const { featureOn, selectedSubItemIds, legendDismissed, setLegendDismissed } = useDoubleCheck();
  const matches = featureOn ? detect(draft, selectedSubItemIds) : [];
  useAutoProtect(draft, matches, onAutoProtect);

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <p className="text-[13.5px]" style={{ color: "var(--ios-label-tertiary)" }}>
              {emptyStateText ?? "Say hello — try typing something with your name, a phone number, or an address."}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className="max-w-[78%] px-3.5 py-2 text-[15px] leading-snug"
                style={{
                  background: m.role === "user" ? accentColor : "var(--ios-fill)",
                  color: m.role === "user" ? "#fff" : "var(--ios-label)",
                  borderRadius: bubbleRadius,
                  borderBottomRightRadius: m.role === "user" ? Math.min(4, bubbleRadius) : bubbleRadius,
                  borderBottomLeftRadius: m.role === "user" ? bubbleRadius : Math.min(4, bubbleRadius),
                }}
              >
                {m.role === "user" ? <HighlightedText text={m.text} matches={featureOn ? detect(m.text, selectedSubItemIds) : []} /> : m.text}
              </div>
              <span className="mt-1 px-1 text-[11px]" style={{ color: "var(--ios-label-tertiary)" }}>
                {m.time}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1 rounded-[18px] px-3.5 py-2.5" style={{ background: "var(--ios-fill)", width: "fit-content" }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--ios-label-tertiary)" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>{!legendDismissed && <PrivacyLegend onDismiss={() => setLegendDismissed(true)} />}</AnimatePresence>

      <div className="px-3 pb-1">
        <div
          className="flex items-end gap-2 rounded-[22px] px-1 py-1"
          style={{ background: "var(--ios-card)", border: "1px solid var(--ios-separator)" }}
        >
          <div className="relative flex-1">
            <ProtectableInput
              value={draft}
              onChange={onDraftChange}
              matches={matches}
              onMatchClick={onMatchClick}
              onSubmit={onSend}
              placeholder="Message"
            />
          </div>
          <button
            onClick={onSend}
            disabled={draft.trim().length === 0}
            className="mb-1 mr-1 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-40"
            style={{ background: accentColor }}
          >
            <ArrowUp size={16} color="#fff" strokeWidth={2.6} />
          </button>
        </div>
        <p className="mt-2 px-2 pb-2 text-center text-[11.5px]" style={{ color: "var(--ios-label-tertiary)" }}>
          Processed on this device. Nothing is sent anywhere until you choose to protect it.
        </p>
      </div>

      {variant === "iphone" && <ProtectSheet match={activeMatch} onProtect={onProtect} onDismiss={onDismissSheet} />}
    </div>
  );
}
