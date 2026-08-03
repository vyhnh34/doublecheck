"use client";

import { Compass, X } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { detect, type Match, type SecuredMatch } from "@/lib/detection";
import { ProtectableInput } from "./ProtectableInput";
import { PrivacyLegend } from "./PrivacyLegend";
import { HighlightedText } from "./HighlightedText";

export function BrowserBar({
  draft,
  secured,
  onDraftChange,
  onSubmit,
  submittedQuery,
  submittedSecured,
  onMatchClick,
}: {
  draft: string;
  secured?: SecuredMatch[];
  onDraftChange: (v: string) => void;
  onSubmit: () => void;
  submittedQuery: string | null;
  submittedSecured?: SecuredMatch[];
  onMatchClick: (match: Match, rect: DOMRect) => void;
}) {
  const { featureOn, selectedSubItemIds, legendDismissed, setLegendDismissed } = useDoubleCheck();
  const matches = featureOn ? detect(draft, selectedSubItemIds) : [];

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: "var(--ios-background)" }}>
      <div className="px-3 pt-3">
        <div
          className="flex items-center gap-2 rounded-[12px] px-2.5 py-1"
          style={{ background: "var(--ios-fill)" }}
        >
          <Compass size={16} strokeWidth={2} style={{ color: "var(--ios-label-secondary)", flexShrink: 0 }} />
          <div className="min-w-0 flex-1">
            <ProtectableInput
              value={draft}
              onChange={onDraftChange}
              matches={matches}
              secured={secured}
              onMatchClick={onMatchClick}
              onSubmit={onSubmit}
              placeholder="Search or enter website name"
            />
          </div>
          {draft.length > 0 && (
            <button onClick={() => onDraftChange("")} className="flex-shrink-0" aria-label="Clear">
              <X size={15} style={{ color: "var(--ios-label-tertiary)" }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {submittedQuery ? (
          <div>
            <p className="mb-3 text-[13px]" style={{ color: "var(--ios-label-secondary)" }}>
              Searching for &ldquo;
              <HighlightedText
                text={submittedQuery}
                matches={featureOn ? detect(submittedQuery, selectedSubItemIds) : []}
                secured={submittedSecured}
              />
              &rdquo;
            </p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-3 rounded-[12px] p-3" style={{ background: "var(--ios-fill)" }}>
                <div className="mb-1.5 h-2.5 w-2/3 rounded-full" style={{ background: "var(--ios-label-tertiary)", opacity: 0.4 }} />
                <div className="h-2 w-full rounded-full" style={{ background: "var(--ios-label-tertiary)", opacity: 0.25 }} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-[13.5px]" style={{ color: "var(--ios-label-tertiary)" }}>
            Try searching for something with your name, a phone number, or an address.
          </p>
        )}
      </div>

      {!legendDismissed && (
        <div className="px-1 pb-1">
          <PrivacyLegend onDismiss={() => setLegendDismissed(true)} />
        </div>
      )}
      <p className="px-3 pb-3 text-center text-[11.5px]" style={{ color: "var(--ios-label-tertiary)" }}>
        Processed on this device. Nothing is sent anywhere until you choose to protect it.
      </p>
    </div>
  );
}
