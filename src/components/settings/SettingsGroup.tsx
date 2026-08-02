import { Children, type ReactNode } from "react";

export function SettingsGroup({ children, footer }: { children: ReactNode; footer?: string }) {
  const rows = Children.toArray(children);
  return (
    <div className="mb-6">
      <div
        className="overflow-hidden rounded-[var(--radius-ios-card)]"
        style={{ background: "var(--ios-card)" }}
      >
        {rows.map((row, i) => (
          <div key={i}>
            {row}
            {i < rows.length - 1 && (
              <div
                className="ml-[52px]"
                style={{ height: 1, background: "var(--ios-separator)" }}
              />
            )}
          </div>
        ))}
      </div>
      {footer && (
        <p className="mt-1.5 px-3.5 text-[12.5px] leading-snug" style={{ color: "var(--ios-label-secondary)" }}>
          {footer}
        </p>
      )}
    </div>
  );
}
