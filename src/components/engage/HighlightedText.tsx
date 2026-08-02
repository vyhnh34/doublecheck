import type { Match } from "@/lib/detection";
import { buildSegments } from "@/lib/segments";

export function HighlightedText({ text, matches }: { text: string; matches: Match[] }) {
  const segments = buildSegments(text, matches);
  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "plain" ? (
          <span key={i}>{seg.text}</span>
        ) : seg.kind === "detected" ? (
          <span
            key={i}
            className="rounded-[3px]"
            style={{ background: "rgba(255,59,48,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-red)" }}
          >
            {seg.text}
          </span>
        ) : (
          <span
            key={i}
            className="rounded-[4px] px-1 py-[1px] text-[13px] font-semibold text-white"
            style={{ background: "var(--ios-green)" }}
          >
            {seg.text}
          </span>
        )
      )}
    </>
  );
}
