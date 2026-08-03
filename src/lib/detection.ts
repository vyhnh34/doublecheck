import { CATEGORIES, type CategoryId } from "@/data/categories";

export interface Match {
  start: number;
  end: number;
  text: string;
  categoryId: CategoryId;
  categoryLabel: string;
  subItemId: string;
  subItemLabel: string;
}

interface PatternConfig {
  pattern: RegExp;
  /** Capture group to highlight instead of the whole match (needs the "d" flag). */
  group?: number;
}

const STREET_SUFFIX =
  "(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Ln|Lane|Dr|Drive|Way|Ct|Court|Pl|Place|Cir|Circle|Ter|Terrace)";

const NAME_STOPWORDS =
  "(?:It|This|That|He|She|They|We|You|There|Here|I|What|Who|When|Where|Why|How|My|Your|Our|His|Her|Their)";

/** A few live patterns layered on top of the sample keyword lists, so typing
 * realistic-looking values (not just the scripted examples) still lights up.
 * These are heuristics for a demo, not real NLP — good enough to show the
 * highlight → protect flow on free-typed text, not a production PII scanner. */
const LIVE_PATTERNS: Partial<Record<string, PatternConfig[]>> = {
  email: [{ pattern: /[\w.+-]+@[\w-]+\.[a-z]{2,}/gid }],
  phone: [{ pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/gd }],
  "card-number": [{ pattern: /\b(?:\d[ -]?){13,16}\b/gd }],
  zip: [{ pattern: /\b\d{5}\b/gd }],
  "home-address": [
    // Street suffix ("St", "Ave", ...) is optional — casual typing ("1743
    // Harrison") drops it as often as it includes it ("1743 Harrison St").
    { pattern: new RegExp(`\\b\\d{1,5}\\s+(?:[A-Z][a-zA-Z']*\\s?){1,4}(?:${STREET_SUFFIX}\\.?)?\\b`, "gd") },
  ],
  "full-name": [
    // "my name is Sam", "I'm Sam" — trigger phrase, then a capitalized name.
    // ("this is X" is deliberately excluded: too often followed by an ordinary
    // word ("this is great") rather than a name, which caused false positives.)
    { pattern: /\b(?:[Mm]y name is|[Ii]'?m|[Ii] am|[Nn]ame'?s)\s+([A-Z][a-zA-Z]*)\b/gd, group: 1 },
    // "Sam is ...", "Sam lives ..." — capitalized subject before a common verb.
    { pattern: new RegExp(`\\b(?!${NAME_STOPWORDS}\\b)([A-Z][a-z]{1,15})\\s+(?:is|was|lives?|works?|called)\\b`, "gd"), group: 1 },
    // "Hey Sam!", "Hi Alex," — a name directly addressed in a greeting.
    { pattern: /\b(?:Hey|Hi|Hello|Dear)[,]?\s+([A-Z][a-zA-Z]{1,15})\b/gd, group: 1 },
  ],
};

function extractSpan(match: RegExpExecArray, group?: number): { start: number; end: number; text: string } | null {
  if (!group) {
    return { start: match.index, end: match.index + match[0].length, text: match[0] };
  }
  const indices = (match as RegExpExecArray & { indices?: Array<[number, number] | undefined> }).indices;
  const span = indices?.[group];
  const text = match[group];
  if (!span || !text) return null;
  return { start: span[0], end: span[1], text };
}

/**
 * Scans `text` for occurrences of the sub-item keywords/patterns belonging to
 * `selectedSubItemIds`. This stands in for on-device NLP detection in the
 * prototype — good enough to demonstrate the highlight → protect flow.
 */
export function detect(text: string, selectedSubItemIds: Set<string>): Match[] {
  if (!text || selectedSubItemIds.size === 0) return [];

  const matches: Match[] = [];

  for (const category of CATEGORIES) {
    for (const subItem of category.subItems) {
      if (!selectedSubItemIds.has(subItem.id)) continue;

      const configs = LIVE_PATTERNS[subItem.id];
      if (configs) {
        for (const { pattern, group } of configs) {
          pattern.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = pattern.exec(text))) {
            const span = extractSpan(m, group);
            if (span) {
              matches.push({
                ...span,
                categoryId: category.id,
                categoryLabel: category.label,
                subItemId: subItem.id,
                subItemLabel: subItem.label,
              });
            }
            if (m[0].length === 0) pattern.lastIndex++; // avoid infinite loop on zero-length matches
          }
        }
      }

      for (const keyword of subItem.keywords) {
        const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (idx === -1) continue;
        matches.push({
          start: idx,
          end: idx + keyword.length,
          text: text.slice(idx, idx + keyword.length),
          categoryId: category.id,
          categoryLabel: category.label,
          subItemId: subItem.id,
          subItemLabel: subItem.label,
        });
      }
    }
  }

  // Sort by position, drop overlaps (keep the first/longer match).
  matches.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const deduped: Match[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      deduped.push(m);
      lastEnd = m.end;
    }
  }
  return deduped;
}

/** Marks a detected match as "secured" — the text itself is never altered;
 * this just flags that span to render with the secured (green) highlight
 * instead of the detected (red) one. Identified by position + exact text so
 * it keeps tracking the same span across re-detection, but naturally falls
 * off if an earlier edit shifts/changes the underlying text. */
export interface SecuredMatch {
  start: number;
  end: number;
  text: string;
}

export function isMatchSecured(match: Match, secured: SecuredMatch[]): boolean {
  return secured.some((s) => s.start === match.start && s.end === match.end && s.text === match.text);
}
