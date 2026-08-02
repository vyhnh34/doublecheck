import type { Match } from "./detection";

export const PLACEHOLDER_RE = /\[Protected(?: — [^\]]+)?\]/g;

export interface Segment {
  text: string;
  kind: "plain" | "detected" | "protected";
  matchIndex?: number;
}

export function buildSegments(value: string, matches: Match[]): Segment[] {
  const ranges: { start: number; end: number; kind: "detected" | "protected"; matchIndex?: number }[] = [];

  matches.forEach((m, i) => ranges.push({ start: m.start, end: m.end, kind: "detected", matchIndex: i }));

  const re = new RegExp(PLACEHOLDER_RE.source, "g");
  let pm: RegExpExecArray | null;
  while ((pm = re.exec(value))) {
    ranges.push({ start: pm.index, end: pm.index + pm[0].length, kind: "protected" });
  }

  ranges.sort((a, b) => a.start - b.start);

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
