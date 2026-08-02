"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Match } from "@/lib/detection";
import { buildSegments } from "@/lib/segments";

const sharedTextStyle: CSSProperties = {
  fontFamily: "var(--font-sf)",
  fontSize: 15.5,
  lineHeight: 1.5,
  padding: "10px 14px",
  margin: 0,
  border: 0,
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  boxSizing: "border-box",
};

export function ProtectableInput({
  value,
  onChange,
  matches,
  onMatchClick,
  placeholder,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  matches: Match[];
  onMatchClick: (match: Match, rect: DOMRect) => void;
  placeholder?: string;
  onSubmit?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [hotspots, setHotspots] = useState<{ matchIndex: number; rect: { top: number; left: number; width: number; height: number } }[]>([]);

  const segments = useMemo(() => buildSegments(value, matches), [value, matches]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const next: { matchIndex: number; rect: { top: number; left: number; width: number; height: number } }[] = [];
    spanRefs.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      next.push({
        matchIndex: idx,
        rect: { top: r.top - containerRect.top, left: r.left - containerRect.left, width: r.width, height: r.height },
      });
    });
    setHotspots(next);
  }, [segments]);

  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  spanRefs.current.clear();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Display layer: shows the styled text (highlights + protected chips) */}
      <div
        aria-hidden
        className="pointer-events-none relative w-full"
        style={{ ...sharedTextStyle, color: "var(--ios-label)", minHeight: 42 }}
      >
        {segments.map((seg, i) =>
          seg.kind === "plain" ? (
            <span key={i}>{seg.text}</span>
          ) : seg.kind === "detected" ? (
            <span
              key={i}
              ref={(el) => {
                if (el && seg.matchIndex !== undefined) spanRefs.current.set(seg.matchIndex, el);
              }}
              className="rounded-[3px]"
              style={{ background: "rgba(255,59,48,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-red)" }}
            >
              {seg.text}
            </span>
          ) : (
            <span
              key={i}
              className="rounded-[4px] px-1 py-[1px] text-[13.5px] font-semibold text-white"
              style={{ background: "var(--ios-green)" }}
            >
              {seg.text}
            </span>
          )
        )}
        {value.length === 0 && (
          <span className="absolute left-3.5 top-2.5" style={{ color: "var(--ios-label-tertiary)" }}>
            {placeholder}
          </span>
        )}
      </div>

      {/* Real textarea: invisible text, visible caret, handles all typing */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={1}
        className="absolute inset-0 resize-none overflow-y-auto outline-none"
        style={{
          ...sharedTextStyle,
          color: "transparent",
          WebkitTextFillColor: "transparent",
          caretColor: "var(--ios-label)",
          background: "transparent",
        }}
      />

      {/* Click-catcher layer: transparent hotspots exactly over each detected match */}
      <div className="pointer-events-none absolute inset-0">
        {hotspots.map(({ matchIndex, rect }) => {
          const match = matches[matchIndex];
          if (!match) return null;
          return (
            <button
              key={matchIndex}
              onClick={(e) => onMatchClick(match, (e.currentTarget as HTMLElement).getBoundingClientRect())}
              className="pointer-events-auto absolute cursor-pointer"
              style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
              aria-label={`Protect ${match.subItemLabel}`}
            />
          );
        })}
      </div>
    </div>
  );
}
