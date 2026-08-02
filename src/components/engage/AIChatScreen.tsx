"use client";

import { motion } from "framer-motion";
import { Plus, ChevronDown, ArrowUp } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { detect, type Match } from "@/lib/detection";
import type { ProductTheme } from "@/data/apps";
import { ClaudeMark, ChatGPTMark } from "@/components/icons/ProductMarks";
import { ProtectableInput } from "./ProtectableInput";
import { ProtectSheet } from "./ProtectSheet";
import { PrivacyLegend } from "./PrivacyLegend";
import { HighlightedText } from "./HighlightedText";
import { useAutoProtect } from "./useAutoProtect";
import type { ThreadMessage } from "./MessageThread";

const THEME_TOKENS: Record<
  ProductTheme,
  {
    bg: string;
    surface: string;
    userBubble: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    accentText: string;
    composerRadius: number;
    greetingFont: string;
    showAssistantAvatar: boolean;
  }
> = {
  claude: {
    bg: "#faf9f5",
    surface: "#ffffff",
    userBubble: "#f0eee6",
    text: "#1f1e1d",
    textMuted: "#73726c",
    border: "rgba(31,30,29,0.10)",
    accent: "#da7756",
    accentText: "#ffffff",
    composerRadius: 26,
    greetingFont: '"Iowan Old Style", Georgia, serif',
    showAssistantAvatar: true,
  },
  chatgpt: {
    bg: "#ffffff",
    surface: "#ffffff",
    userBubble: "#f4f4f4",
    text: "#0d0d0d",
    textMuted: "#5d5d5d",
    border: "#e7e7e7",
    accent: "#0d0d0d",
    accentText: "#ffffff",
    composerRadius: 28,
    greetingFont: "var(--font-sf)",
    showAssistantAvatar: false,
  },
};

export function AIChatScreen({
  variant,
  productTheme,
  appName,
  modelLabel,
  greeting,
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
}: {
  variant: "iphone" | "mac";
  productTheme: ProductTheme;
  appName: string;
  modelLabel: string;
  greeting: string;
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
}) {
  const { featureOn, selectedSubItemIds, legendDismissed, setLegendDismissed } = useDoubleCheck();
  const matches = featureOn ? detect(draft, selectedSubItemIds) : [];
  useAutoProtect(draft, matches, onAutoProtect);

  const t = THEME_TOKENS[productTheme];
  const Mark = productTheme === "claude" ? ClaudeMark : ChatGPTMark;
  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: t.bg, fontFamily: "var(--font-sf)" }}>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <Mark size={30} className="opacity-90" style={{ color: t.accent } as React.CSSProperties} />
            <h1 style={{ fontFamily: t.greetingFont, fontWeight: productTheme === "claude" ? 400 : 500, fontSize: 22, color: t.text }}>
              {greeting}
            </h1>
          </div>
        ) : (
          <div className="mx-auto flex max-w-[520px] flex-col gap-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "items-start"}`}>
                {m.role === "assistant" && t.showAssistantAvatar && (
                  <span className="mt-0.5 flex-shrink-0">
                    <Mark size={18} style={{ color: t.accent }} />
                  </span>
                )}
                {m.role === "user" ? (
                  <div
                    className="max-w-[80%] px-3.5 py-2 text-[15px] leading-snug"
                    style={{ background: t.userBubble, color: t.text, borderRadius: 16 }}
                  >
                    <HighlightedText text={m.text} matches={featureOn ? detect(m.text, selectedSubItemIds) : []} />
                  </div>
                ) : (
                  <p className="max-w-[85%] text-[15px] leading-relaxed" style={{ color: t.text }}>
                    {m.text}
                  </p>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: t.textMuted }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-[520px] px-3 pb-1">
        {!legendDismissed && <PrivacyLegend onDismiss={() => setLegendDismissed(true)} />}

        <div
          className="flex flex-col gap-2 border px-3.5 pb-2 pt-3"
          style={{ background: t.surface, borderColor: t.border, borderRadius: t.composerRadius }}
        >
          <ProtectableInput
            value={draft}
            onChange={onDraftChange}
            matches={matches}
            onMatchClick={onMatchClick}
            onSubmit={onSend}
            placeholder={`Message ${appName}`}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border"
              style={{ borderColor: t.border, color: t.textMuted }}
              aria-label="Attach"
            >
              <Plus size={16} strokeWidth={2} />
            </button>

            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-medium"
                style={{ color: t.textMuted }}
              >
                {modelLabel}
                <ChevronDown size={14} strokeWidth={2.2} />
              </span>
              <button
                onClick={onSend}
                disabled={draft.trim().length === 0}
                className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-40"
                style={{ background: t.accent }}
              >
                <ArrowUp size={16} color={t.accentText} strokeWidth={2.6} />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 px-2 pb-2 text-center text-[11.5px]" style={{ color: t.textMuted }}>
          {appName} can make mistakes. This is a prototype — replies are simulated.
        </p>
      </div>

      {variant === "iphone" && <ProtectSheet match={activeMatch} onProtect={onProtect} onDismiss={onDismissSheet} />}
    </div>
  );
}
