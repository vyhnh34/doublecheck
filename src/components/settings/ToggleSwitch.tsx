"use client";

export function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className="relative inline-block flex-shrink-0 overflow-hidden rounded-full border-0 p-0 transition-colors duration-200"
      style={{
        width: 51,
        height: 31,
        boxSizing: "border-box",
        background: on ? "#34c759" : "rgba(120,120,128,0.24)",
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow-md transition-transform duration-200"
        style={{
          top: 2,
          left: 2,
          width: 27,
          height: 27,
          transform: on ? "translateX(20px)" : "translateX(0)",
        }}
      />
    </button>
  );
}
