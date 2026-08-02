import type { Match, SecuredMatch } from "@/lib/detection";
import { buildSegments } from "@/lib/segments";

export function HighlightedText({ text, matches, secured }: { text: string; matches: Match[]; secured?: SecuredMatch[] }) {
  const segments = buildSegments(text, matches, secured);
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
            className="rounded-[3px]"
            style={{ background: "rgba(52,199,89,0.16)", boxShadow: "inset 0 -1.5px 0 var(--ios-green)" }}
          >
            {seg.text}
          </span>
        )
      )}
    </>
  );
}
