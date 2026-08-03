"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CATEGORIES } from "@/data/categories";

const STORAGE_KEY = "doublecheck.state.v1";

export type DeviceMode = "iphone" | "mac";
export type ProtectionMode = "review" | "auto";

interface PersistedState {
  selection: Record<string, boolean>;
  featureOn: boolean;
  protectionMode: ProtectionMode;
  onboardingComplete: boolean;
  enticeDismissedOnce: boolean;
  legendDismissed: boolean;
  deviceMode: DeviceMode;
  categoryOrder: string[];
}

interface DoubleCheckContextValue extends PersistedState {
  hydrated: boolean;
  toggleSubItem: (subItemId: string) => void;
  toggleCategory: (categoryId: string, value: boolean) => void;
  toggleAll: (value: boolean) => void;
  isSubItemSelected: (subItemId: string) => boolean;
  categoryCheckState: (categoryId: string) => "checked" | "unchecked" | "indeterminate";
  allCheckState: () => "checked" | "unchecked" | "indeterminate";
  selectedSubItemIds: Set<string>;
  setFeatureOn: (on: boolean) => void;
  setProtectionMode: (mode: ProtectionMode) => void;
  setOnboardingComplete: (done: boolean) => void;
  setEnticeDismissedOnce: (v: boolean) => void;
  setLegendDismissed: (v: boolean) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  reorderCategories: (order: string[]) => void;
  orderedCategories: typeof CATEGORIES;
}

const ALL_SUB_ITEM_IDS = CATEGORIES.flatMap((c) => c.subItems.map((s) => s.id));

const DEFAULT_STATE: PersistedState = {
  selection: Object.fromEntries(ALL_SUB_ITEM_IDS.map((id) => [id, true])),
  featureOn: true,
  protectionMode: "review",
  onboardingComplete: false,
  enticeDismissedOnce: false,
  legendDismissed: false,
  deviceMode: "iphone",
  categoryOrder: CATEGORIES.map((c) => c.id),
};

const DoubleCheckContext = createContext<DoubleCheckContextValue | null>(null);

function loadState(): PersistedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, selection: { ...DEFAULT_STATE.selection, ...parsed.selection } };
  } catch {
    return DEFAULT_STATE;
  }
}

export function DoubleCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const toggleSubItem = useCallback((subItemId: string) => {
    setState((s) => ({
      ...s,
      selection: { ...s.selection, [subItemId]: !s.selection[subItemId] },
    }));
  }, []);

  const toggleCategory = useCallback((categoryId: string, value: boolean) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;
    setState((s) => {
      const next = { ...s.selection };
      for (const sub of category.subItems) next[sub.id] = value;
      return { ...s, selection: next };
    });
  }, []);

  const toggleAll = useCallback((value: boolean) => {
    setState((s) => ({
      ...s,
      selection: Object.fromEntries(ALL_SUB_ITEM_IDS.map((id) => [id, value])),
    }));
  }, []);

  const isSubItemSelected = useCallback(
    (subItemId: string) => Boolean(state.selection[subItemId]),
    [state.selection]
  );

  const categoryCheckState = useCallback(
    (categoryId: string): "checked" | "unchecked" | "indeterminate" => {
      const category = CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return "unchecked";
      const values = category.subItems.map((s) => Boolean(state.selection[s.id]));
      if (values.every(Boolean)) return "checked";
      if (values.every((v) => !v)) return "unchecked";
      return "indeterminate";
    },
    [state.selection]
  );

  const allCheckState = useCallback((): "checked" | "unchecked" | "indeterminate" => {
    const values = ALL_SUB_ITEM_IDS.map((id) => Boolean(state.selection[id]));
    if (values.every(Boolean)) return "checked";
    if (values.every((v) => !v)) return "unchecked";
    return "indeterminate";
  }, [state.selection]);

  const selectedSubItemIds = useMemo(
    () => new Set(Object.entries(state.selection).filter(([, v]) => v).map(([k]) => k)),
    [state.selection]
  );

  const setFeatureOn = useCallback((on: boolean) => setState((s) => ({ ...s, featureOn: on })), []);
  const setProtectionMode = useCallback(
    (mode: ProtectionMode) => setState((s) => ({ ...s, protectionMode: mode })),
    []
  );
  const setOnboardingComplete = useCallback(
    (done: boolean) => setState((s) => ({ ...s, onboardingComplete: done })),
    []
  );
  const setEnticeDismissedOnce = useCallback(
    (v: boolean) => setState((s) => ({ ...s, enticeDismissedOnce: v })),
    []
  );
  const setLegendDismissed = useCallback(
    (v: boolean) => setState((s) => ({ ...s, legendDismissed: v })),
    []
  );
  const setDeviceMode = useCallback(
    (mode: DeviceMode) => setState((s) => ({ ...s, deviceMode: mode })),
    []
  );
  const reorderCategories = useCallback(
    (order: string[]) => setState((s) => ({ ...s, categoryOrder: order })),
    []
  );

  const orderedCategories = useMemo(() => {
    const byId = new Map(CATEGORIES.map((c) => [c.id, c]));
    const ordered = state.categoryOrder
      .map((id) => byId.get(id as (typeof CATEGORIES)[number]["id"]))
      .filter((c): c is (typeof CATEGORIES)[number] => Boolean(c));
    for (const c of CATEGORIES) if (!state.categoryOrder.includes(c.id)) ordered.push(c);
    return ordered;
  }, [state.categoryOrder]);

  const value: DoubleCheckContextValue = {
    ...state,
    hydrated,
    toggleSubItem,
    toggleCategory,
    toggleAll,
    isSubItemSelected,
    categoryCheckState,
    allCheckState,
    selectedSubItemIds,
    setFeatureOn,
    setProtectionMode,
    setOnboardingComplete,
    setEnticeDismissedOnce,
    setLegendDismissed,
    setDeviceMode,
    reorderCategories,
    orderedCategories,
  };

  return <DoubleCheckContext.Provider value={value}>{children}</DoubleCheckContext.Provider>;
}

export function useDoubleCheck() {
  const ctx = useContext(DoubleCheckContext);
  if (!ctx) throw new Error("useDoubleCheck must be used within DoubleCheckProvider");
  return ctx;
}
