"use client";

import { Check, Minus } from "lucide-react";

export type CheckState = "checked" | "unchecked" | "indeterminate";

export function TriStateCheckbox({
  state,
  onToggle,
  size = 22,
}: {
  state: CheckState;
  onToggle: () => void;
  size?: number;
}) {
  const filled = state !== "unchecked";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      className="grid flex-shrink-0 place-items-center rounded-[7px] transition-colors"
      style={{
        width: size,
        height: size,
        background: filled ? "var(--ios-blue)" : "transparent",
        border: filled ? "none" : "1.5px solid var(--ios-label-tertiary)",
      }}
    >
      {state === "checked" && <Check size={size * 0.68} color="#fff" strokeWidth={3} />}
      {state === "indeterminate" && <Minus size={size * 0.68} color="#fff" strokeWidth={3} />}
    </button>
  );
}
