import { useEffect } from "react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import type { Match } from "@/lib/detection";

/**
 * In auto-protect mode, applies the first match that isn't still touching the
 * end of the text (i.e. the user has moved on / typed past it), one match at
 * a time — each application triggers a re-render with fresh matches, so this
 * naturally cascades through everything detected. A match still glued to the
 * very end of the text is left alone since the user may still be mid-word;
 * the page-level send/submit handlers sweep any stragglers as a safety net.
 */
export function useAutoProtect(text: string, matches: Match[], onAutoProtect: (match: Match) => void) {
  const { protectionMode } = useDoubleCheck();

  useEffect(() => {
    if (protectionMode !== "auto") return;
    const safe = matches.find((m) => m.end < text.length);
    if (safe) onAutoProtect(safe);
  }, [protectionMode, matches, text, onAutoProtect]);
}
