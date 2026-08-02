"use client";

import {
  ChevronDown,
  ChevronUp,
  Info,
  CreditCard,
  FileText,
  Heart,
  BookOpen,
  MapPin,
  Users,
  Briefcase,
  Paintbrush,
  Star,
} from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { TriStateCheckbox } from "./TriStateCheckbox";
import type { Category, CategoryId } from "@/data/categories";

const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  financial: CreditCard,
  identity: FileText,
  health: Heart,
  thoughts: BookOpen,
  location: MapPin,
  relationships: Users,
  work: Briefcase,
  creative: Paintbrush,
  preferences: Star,
};

interface CategoryAccordionProps {
  categories: Category[];
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  showSelectAll?: boolean;
  onMove?: (id: string, direction: "up" | "down") => void;
}

export function CategoryAccordion({
  categories,
  expanded,
  onToggleExpand,
  showSelectAll = true,
  onMove,
}: CategoryAccordionProps) {
  const { allCheckState, toggleAll, categoryCheckState, toggleCategory, isSubItemSelected, toggleSubItem } =
    useDoubleCheck();

  return (
    <div className="overflow-hidden rounded-[var(--radius-ios-card)]" style={{ background: "var(--ios-card)" }}>
      {showSelectAll && (
        <div
          className="flex items-center gap-3 px-3.5 py-3"
          style={{ borderBottom: "1px solid var(--ios-separator)" }}
        >
          <TriStateCheckbox state={allCheckState()} onToggle={() => toggleAll(allCheckState() !== "checked")} />
          <span className="text-[15px] font-semibold" style={{ color: "var(--ios-label)" }}>
            Select all
          </span>
        </div>
      )}

      {categories.map((category, i) => {
        const isOpen = expanded.has(category.id);
        return (
          <div key={category.id} style={{ borderTop: i > 0 || showSelectAll ? "1px solid var(--ios-separator)" : "none" }}>
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => onToggleExpand(category.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleExpand(category.id);
                }
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-3"
            >
              {onMove && (
                <span className="flex flex-shrink-0 flex-col -ml-1 mr-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove(category.id, "up");
                    }}
                    className="opacity-50 hover:opacity-100"
                  >
                    <ChevronUp size={13} style={{ color: "var(--ios-label-secondary)" }} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove(category.id, "down");
                    }}
                    className="opacity-50 hover:opacity-100"
                  >
                    <ChevronDown size={13} style={{ color: "var(--ios-label-secondary)" }} />
                  </button>
                </span>
              )}
              <TriStateCheckbox
                state={categoryCheckState(category.id)}
                onToggle={() => toggleCategory(category.id, categoryCheckState(category.id) !== "checked")}
              />
              <span
                className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-[8px]"
                style={{ background: "var(--ios-fill)" }}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[category.id];
                  return <Icon size={15} color="var(--ios-label-secondary)" strokeWidth={2.1} />;
                })()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium" style={{ color: "var(--ios-label)" }}>
                  {category.label}
                </span>
                <span className="block truncate text-[12.5px]" style={{ color: "var(--ios-label-secondary)" }}>
                  {category.description}
                </span>
              </span>
              {isOpen ? (
                <ChevronUp size={16} style={{ color: "var(--ios-label-tertiary)" }} />
              ) : (
                <ChevronDown size={16} style={{ color: "var(--ios-label-tertiary)" }} />
              )}
            </div>

            {isOpen && (
              <div className="pb-2 pl-[74px] pr-3.5">
                {category.subItems.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2.5 py-2"
                    onClick={() => toggleSubItem(sub.id)}
                  >
                    <TriStateCheckbox
                      size={18}
                      state={isSubItemSelected(sub.id) ? "checked" : "unchecked"}
                      onToggle={() => toggleSubItem(sub.id)}
                    />
                    <span className="text-[14px]" style={{ color: "var(--ios-label)" }}>
                      {sub.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-start gap-1.5 px-1 text-[12.5px]" style={{ color: "var(--ios-label-secondary)" }}>
      <Info size={13} className="mt-[1.5px] flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
