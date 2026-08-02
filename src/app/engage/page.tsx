"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DeviceStage } from "@/components/device/DeviceStage";
import { DeviceSwitcher } from "@/components/device/DeviceSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { MacBookFrame } from "@/components/device/MacBookFrame";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { MacDock } from "@/components/device/MacDock";
import { HomeScreen } from "@/components/engage/HomeScreen";
import { MessageThread, type ThreadMessage } from "@/components/engage/MessageThread";
import { AIChatScreen } from "@/components/engage/AIChatScreen";
import { BrowserBar } from "@/components/engage/BrowserBar";
import { ProtectPopover } from "@/components/engage/ProtectPopover";
import { APPS } from "@/data/apps";
import { detect, protectAllMatches, type Match } from "@/lib/detection";

const REPLIES = [
  "Got it — thanks for letting me know!",
  "Sounds good, I've made a note of that.",
  "Thanks for sharing — noted.",
];

type ChatAppId = "messages" | "claude" | "chatgpt";
type View = "home" | ChatAppId | "browser";
type Variant = "iphone" | "mac";

interface ThreadState {
  messages: ThreadMessage[];
  draft: string;
}

interface RectSnapshot {
  top: number;
  left: number;
  width: number;
  height: number;
}

const emptyThread = (): ThreadState => ({ messages: [], draft: "" });

export default function EngagePage() {
  const router = useRouter();
  const { enticeDismissedOnce, setEnticeDismissedOnce, deviceMode, featureOn, selectedSubItemIds, protectionMode } =
    useDoubleCheck();

  const [view, setView] = useState<View>("home");
  const [threads, setThreads] = useState<Record<ChatAppId, ThreadState>>({
    messages: emptyThread(),
    claude: emptyThread(),
    chatgpt: emptyThread(),
  });
  const [browserDraft, setBrowserDraft] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [activeMatchRect, setActiveMatchRect] = useState<RectSnapshot | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showReminder, setShowReminder] = useState(enticeDismissedOnce);

  const isChatApp = (v: View): v is ChatAppId => v === "messages" || v === "claude" || v === "chatgpt";

  const openApp = (id: string) => {
    if (id === "settings") {
      router.push("/extend");
      return;
    }
    if (id === "browser" || isChatApp(id as View)) {
      setView(id as View);
    }
  };

  const handleMatchClick = (match: Match, rect: DOMRect) => {
    setActiveMatch(match);
    setActiveMatchRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
  };
  const handleDismissSheet = () => {
    setActiveMatch(null);
    setActiveMatchRect(null);
  };

  /** Applies one match's placeholder to whichever screen is currently open. Used
   * both by the manual sheet/popover "Protect" button and by auto-protect mode. */
  const protectMatch = (match: Match, targetView: View = view) => {
    const placeholder = `[Protected — ${match.categoryLabel}]`;
    const apply = (text: string) => {
      if (text.slice(match.start, match.end) !== match.text) return text;
      return text.slice(0, match.start) + placeholder + text.slice(match.end);
    };

    if (targetView === "browser") {
      setBrowserDraft((prev) => apply(prev));
    } else if (isChatApp(targetView)) {
      setThreads((prev) => ({ ...prev, [targetView]: { ...prev[targetView], draft: apply(prev[targetView].draft) } }));
    }
  };

  const handleProtect = () => {
    if (!activeMatch) return;
    protectMatch(activeMatch);
    setActiveMatch(null);
    setActiveMatchRect(null);
  };

  const setThreadDraft = (appId: ChatAppId, draft: string) => {
    setThreads((prev) => ({ ...prev, [appId]: { ...prev[appId], draft } }));
  };

  /** Safety net: in auto-protect mode, sweep any still-unprotected matches into
   * placeholders right before the text leaves the input (send/search), so a
   * match sitting at the very end of the text (still "in progress" while
   * typing) never slips through unprotected. */
  const sweepAutoProtect = (text: string): string => {
    if (protectionMode !== "auto" || !featureOn) return text;
    const matches = detect(text, selectedSubItemIds);
    return protectAllMatches(text, matches);
  };

  const handleSend = (appId: ChatAppId) => {
    const text = sweepAutoProtect(threads[appId].draft).trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreads((prev) => ({
      ...prev,
      [appId]: { messages: [...prev[appId].messages, { id: crypto.randomUUID(), role: "user", text, time }], draft: "" },
    }));
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setThreads((prev) => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          messages: [
            ...prev[appId].messages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: REPLIES[Math.min(prev[appId].messages.length, REPLIES.length - 1)],
              time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            },
          ],
        },
      }));
    }, 1000);
  };

  const handleBrowserSubmit = () => {
    const swept = sweepAutoProtect(browserDraft);
    if (swept !== browserDraft) setBrowserDraft(swept);
    setSubmittedQuery(swept.trim() || null);
  };

  const dismissReminder = () => {
    setShowReminder(false);
    setEnticeDismissedOnce(false);
  };

  const enabledIds = ["messages", "browser", "claude", "chatgpt", "settings"];
  const homeScreen = <HomeScreen onOpenApp={openApp} enabledIds={enabledIds} />;

  const chatScreen = (appId: ChatAppId, variant: Variant) => {
    const app = APPS.find((a) => a.id === appId)!;

    if (appId === "messages") {
      return (
        <div className="relative flex h-full flex-col">
          {showReminder && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5" style={{ background: "var(--ios-blue)" }}>
              <p className="flex-1 text-[12.5px] leading-snug text-white">
                Don&apos;t forget — DoubleCheck can protect sensitive info here. Set it up in Settings.
              </p>
              <button onClick={dismissReminder} aria-label="Dismiss reminder">
                <X size={15} color="#fff" />
              </button>
            </div>
          )}
          <MessageThread
            variant={variant}
            accentColor={app.accent ?? "#34c759"}
            bubbleRadius={app.bubbleRadius}
            messages={threads[appId].messages}
            draft={threads[appId].draft}
            onDraftChange={(v) => setThreadDraft(appId, v)}
            onSend={() => handleSend(appId)}
            activeMatch={view === appId ? activeMatch : null}
            onMatchClick={handleMatchClick}
            onProtect={handleProtect}
            onDismissSheet={handleDismissSheet}
            onAutoProtect={(match) => protectMatch(match, appId)}
            isTyping={view === appId && isTyping}
          />
        </div>
      );
    }

    return (
      <AIChatScreen
        variant={variant}
        productTheme={app.productTheme ?? "claude"}
        appName={app.name}
        modelLabel={app.modelLabel ?? ""}
        greeting={app.greeting ?? "How can I help you today?"}
        messages={threads[appId].messages}
        draft={threads[appId].draft}
        onDraftChange={(v) => setThreadDraft(appId, v)}
        onSend={() => handleSend(appId)}
        activeMatch={view === appId ? activeMatch : null}
        onMatchClick={handleMatchClick}
        onProtect={handleProtect}
        onDismissSheet={handleDismissSheet}
        onAutoProtect={(match) => protectMatch(match, appId)}
        isTyping={view === appId && isTyping}
      />
    );
  };

  const browserScreen = (variant: Variant) => (
    <BrowserBar
      variant={variant}
      draft={browserDraft}
      onDraftChange={setBrowserDraft}
      onSubmit={handleBrowserSubmit}
      submittedQuery={submittedQuery}
      activeMatch={view === "browser" ? activeMatch : null}
      onMatchClick={handleMatchClick}
      onProtect={handleProtect}
      onDismissSheet={handleDismissSheet}
      onAutoProtect={(match) => protectMatch(match, "browser")}
    />
  );

  const contentFor = (variant: Variant) =>
    view === "home" ? homeScreen : view === "browser" ? browserScreen(variant) : chatScreen(view, variant);

  const titleFor = (v: View) => (v === "home" ? "Home" : APPS.find((a) => a.id === v)?.name ?? "Home");

  // macOS has no "home screen inside a window" — with nothing open you just see
  // the Desktop. The Dock is what switches apps; there's no "back to home"
  // button to click, and it's rendered inside the laptop's own screen area.
  const macDock = <MacDock activeId={view} onOpenApp={openApp} />;
  const macDesktop = (
    <div
      className="mx-auto rounded-[10px]"
      style={{
        width: "100%",
        maxWidth: 880,
        height: 620,
        background: "linear-gradient(160deg, #4c6a92 0%, #26374f 55%, #131c2b 100%)",
      }}
    />
  );

  return (
    <main className="min-h-screen pb-10" style={{ background: "#000" }}>
      <DeviceSwitcher />
      <DeviceStage
        mac={
          view === "home" ? (
            <MacBookFrame appName="Finder" fillScreen dock={macDock}>
              {macDesktop}
            </MacBookFrame>
          ) : (
            <MacWindow windowTitle={titleFor(view)} dock={macDock}>
              {contentFor("mac")}
            </MacWindow>
          )
        }
        iphone={
          <IPhoneShell
            title={titleFor(view)}
            onSwipeHome={view === "home" ? undefined : () => setView("home")}
            scrollable={view === "home"}
          >
            {contentFor("iphone")}
          </IPhoneShell>
        }
      />
      {deviceMode === "mac" && (
        <ProtectPopover match={activeMatch} rect={activeMatchRect} onProtect={handleProtect} onDismiss={handleDismissSheet} />
      )}
    </main>
  );
}
