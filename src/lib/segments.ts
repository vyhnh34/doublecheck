import { isMatchSecured, type Match, type SecuredMatch } from "./detection";

export interface Segment {
  text: string;
  kind: "plain" | "detected" | "protected";
  matchIndex?: number;
}

/** Splits `value` into plain/detected/secured runs. The text itself is never
 * altered — a match renders as "protected" (secured, green) instead of
 * "detected" (red) purely based on whether it's in `secured`. */
export function buildSegments(value: string, matches: Match[], secured: SecuredMatch[] = []): Segment[] {
  const ranges = matches
    .map((m, i) => ({
      start: m.start,
      end: m.end,
      kind: (isMatchSecured(m, secured) ? "protected" : "detected") as "protected" | "detected",
      matchIndex: i,
    }))
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue;
    if (r.start > cursor) segments.push({ text: value.slice(cursor, r.start), kind: "plain" });
    segments.push({ text: value.slice(r.start, r.end), kind: r.kind, matchIndex: r.matchIndex });
    cursor = r.end;
  }
  if (cursor < value.length) segments.push({ text: value.slice(cursor), kind: "plain" });
  if (segments.length === 0) segments.push({ text: "", kind: "plain" });
  return segments;
}
