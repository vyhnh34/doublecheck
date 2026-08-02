"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DeviceStage } from "@/components/device/DeviceStage";
import { VersionSwitcher } from "@/components/device/VersionSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { MacBookFrame } from "@/components/device/MacBookFrame";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { MacDock } from "@/components/device/MacDock";
import { HomeScreen } from "@/components/engage/HomeScreen";
import { MessageThread, type ThreadMessage } from "@/components/engage/MessageThread";
import { AIChatScreen } from "@/components/engage/AIChatScreen";
import { BrowserBar } from "@/components/engage/BrowserBar";
import { DetectedPopover } from "@/components/engage/DetectedPopover";
import { SecuredPopover } from "@/components/engage/SecuredPopover";
import { APPS } from "@/data/apps";
import { detect, isMatchSecured, type Match, type SecuredMatch } from "@/lib/detection";

const REPLIES = [
  "Got it, thanks for letting me know!",
  "Sounds good, noted.",
  "Thanks for sharing.",
];

type ChatAppId = "messages" | "claude" | "chatgpt";
type View = "home" | ChatAppId | "browser";

interface ThreadState {
  messages: ThreadMessage[];
  draft: string;
  secured: SecuredMatch[];
}

interface RectSnapshot {
  top: number;
  left: number;
  width: number;
  height: number;
}

const emptyThread = (): ThreadState => ({ messages: [], draft: "", secured: [] });

/** Drops leading/trailing whitespace, shifting any secured spans to match. */
function trimWithSecured(text: string, secured: SecuredMatch[]): { text: string; secured: SecuredMatch[] } {
  const leadingTrim = text.length - text.trimStart().length;
  const trimmed = text.trim();
  if (leadingTrim === 0) return { text: trimmed, secured };
  return {
    text: trimmed,
    secured: secured.map((s) => ({ ...s, start: s.start - leadingTrim, end: s.end - leadingTrim })).filter((s) => s.start >= 0),
  };
}

export default function EngagePage() {
  const router = useRouter();
  const { enticeDismissedOnce, setEnticeDismissedOnce, featureOn, selectedSubItemIds, protectionMode } = useDoubleCheck();

  const [view, setView] = useState<View>("home");
  const [threads, setThreads] = useState<Record<ChatAppId, ThreadState>>({
    messages: emptyThread(),
    claude: emptyThread(),
    chatgpt: emptyThread(),
  });
  const [browserDraft, setBrowserDraft] = useState("");
  const [browserSecured, setBrowserSecured] = useState<SecuredMatch[]>([]);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [submittedSecured, setSubmittedSecured] = useState<SecuredMatch[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [activeMatchRect, setActiveMatchRect] = useState<RectSnapshot | null>(null);
  const [activeMatchSecured, setActiveMatchSecured] = useState(false);
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

  const securedFor = (targetView: View): SecuredMatch[] =>
    targetView === "browser" ? browserSecured : isChatApp(targetView) ? threads[targetView].secured : [];

  const handleMatchClick = (match: Match, rect: DOMRect) => {
    setActiveMatch(match);
    setActiveMatchRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setActiveMatchSecured(isMatchSecured(match, securedFor(view)));
  };
  const handleDismissSheet = () => {
    setActiveMatch(null);
    setActiveMatchRect(null);
  };

  /** Flags a match as secured (green highlight) without touching the text
   * itself — used by the manual sheet/popover "Protect" button. */
  const secureMatch = (match: Match, targetView: View = view) => {
    const entry: SecuredMatch = { start: match.start, end: match.end, text: match.text };
    if (targetView === "browser") {
      setBrowserSecured((prev) => [...prev, entry]);
    } else if (isChatApp(targetView)) {
      setThreads((prev) => ({ ...prev, [targetView]: { ...prev[targetView], secured: [...prev[targetView].secured, entry] } }));
    }
  };

  /** Reverts a secured match back to plain detected — used by the "Secured"
   * tooltip's undo button. */
  const unsecureMatch = (match: Match, targetView: View = view) => {
    const remove = (list: SecuredMatch[]) =>
      list.filter((s) => !(s.start === match.start && s.end === match.end && s.text === match.text));
    if (targetView === "browser") {
      setBrowserSecured(remove);
    } else if (isChatApp(targetView)) {
      setThreads((prev) => ({ ...prev, [targetView]: { ...prev[targetView], secured: remove(prev[targetView].secured) } }));
    }
  };

  const handleProtect = () => {
    if (!activeMatch) return;
    secureMatch(activeMatch);
    setActiveMatch(null);
    setActiveMatchRect(null);
  };

  const handleUndo = () => {
    if (!activeMatch) return;
    unsecureMatch(activeMatch);
    setActiveMatch(null);
    setActiveMatchRect(null);
  };

  const setThreadDraft = (appId: ChatAppId, draft: string) => {
    setThreads((prev) => ({ ...prev, [appId]: { ...prev[appId], draft } }));
  };

  /** In auto-protect mode, nothing is secured while typing — matches just
   * stay highlighted red like review mode. This is the one point protection
   * actually happens: right as the text leaves the input (send/search), every
   * remaining unsecured match (plus anything already secured manually) is
   * flagged secured together. */
  const sweepAutoProtect = (text: string, secured: SecuredMatch[]): SecuredMatch[] => {
    if (protectionMode !== "auto" || !featureOn) return secured;
    const matches = detect(text, selectedSubItemIds);
    const additions = matches
      .filter((m) => !isMatchSecured(m, secured))
      .map((m): SecuredMatch => ({ start: m.start, end: m.end, text: m.text }));
    return [...secured, ...additions];
  };

  const handleSend = (appId: ChatAppId) => {
    const sweptSecured = sweepAutoProtect(threads[appId].draft, threads[appId].secured);
    const { text, secured } = trimWithSecured(threads[appId].draft, sweptSecured);
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreads((prev) => ({
      ...prev,
      [appId]: {
        messages: [...prev[appId].messages, { id: crypto.randomUUID(), role: "user", text, time, secured }],
        draft: "",
        secured: [],
      },
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
    const sweptSecured = sweepAutoProtect(browserDraft, browserSecured);
    if (sweptSecured !== browserSecured) setBrowserSecured(sweptSecured);
    const { text, secured } = trimWithSecured(browserDraft, sweptSecured);
    setSubmittedQuery(text || null);
    setSubmittedSecured(secured);
  };

  const dismissReminder = () => {
    setShowReminder(false);
    setEnticeDismissedOnce(false);
  };

  const enabledIds = ["messages", "browser", "claude", "chatgpt", "settings"];
  const homeScreen = <HomeScreen onOpenApp={openApp} enabledIds={enabledIds} />;

  const chatScreen = (appId: ChatAppId) => {
    const app = APPS.find((a) => a.id === appId)!;

    if (appId === "messages") {
      return (
        <div className="relative flex h-full flex-col">
          {showReminder && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5" style={{ background: "var(--ios-blue)" }}>
              <p className="flex-1 text-[12.5px] leading-snug text-white">
                DoubleCheck can protect sensitive info here. Set it up in Settings.
              </p>
              <button onClick={dismissReminder} aria-label="Dismiss reminder">
                <X size={15} color="#fff" />
              </button>
            </div>
          )}
          <MessageThread
            accentColor={app.accent ?? "#34c759"}
            bubbleRadius={app.bubbleRadius}
            messages={threads[appId].messages}
            draft={threads[appId].draft}
            secured={threads[appId].secured}
            onDraftChange={(v) => setThreadDraft(appId, v)}
            onSend={() => handleSend(appId)}
            onMatchClick={handleMatchClick}
            isTyping={view === appId && isTyping}
          />
        </div>
      );
    }

    return (
      <AIChatScreen
        productTheme={app.productTheme ?? "claude"}
        appName={app.name}
        modelLabel={app.modelLabel ?? ""}
        greeting={app.greeting ?? "How can I help you today?"}
        messages={threads[appId].messages}
        draft={threads[appId].draft}
        secured={threads[appId].secured}
        onDraftChange={(v) => setThreadDraft(appId, v)}
        onSend={() => handleSend(appId)}
        onMatchClick={handleMatchClick}
        isTyping={view === appId && isTyping}
      />
    );
  };

  const browserScreen = (
    <BrowserBar
      draft={browserDraft}
      onDraftChange={setBrowserDraft}
      secured={browserSecured}
      onSubmit={handleBrowserSubmit}
      submittedQuery={submittedQuery}
      submittedSecured={submittedSecured}
      onMatchClick={handleMatchClick}
    />
  );

  const contentFor = () => (view === "home" ? homeScreen : view === "browser" ? browserScreen : chatScreen(view));

  const titleFor = (v: View) => (v === "home" ? "Home" : APPS.find((a) => a.id === v)?.name ?? "Home");

  // macOS has no "home screen inside a window" — with nothing open you just see
  // the Desktop. The Dock is what switches apps; there's no "back to home"
  // button to click, and it's rendered inside the laptop's own screen area.
  const macDock = <MacDock activeId={view} onOpenApp={openApp} />;
  const macDesktop = (
    <div
      className="h-full w-full"
      style={{ background: "linear-gradient(160deg, #4c6a92 0%, #26374f 55%, #131c2b 100%)" }}
    />
  );

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <VersionSwitcher />
      <DeviceStage
        mac={
          view === "home" ? (
            <MacBookFrame appName="Finder" fillScreen dock={macDock}>
              {macDesktop}
            </MacBookFrame>
          ) : (
            <MacWindow windowTitle={titleFor(view)} dock={macDock} onClose={() => setView("home")}>
              {contentFor()}
            </MacWindow>
          )
        }
        iphone={
          <IPhoneShell
            title={titleFor(view)}
            onSwipeHome={view === "home" ? undefined : () => setView("home")}
            scrollable={view === "home"}
            hideTitleBar={view === "home"}
            fullBleed={view === "home"}
            statusBarTint={view === "home" ? "light" : "dark"}
          >
            {contentFor()}
          </IPhoneShell>
        }
      />
      {!activeMatchSecured && (
        <DetectedPopover match={activeMatch} rect={activeMatchRect} onProtect={handleProtect} onDismiss={handleDismissSheet} />
      )}
      {activeMatchSecured && (
        <SecuredPopover match={activeMatch} rect={activeMatchRect} onUndo={handleUndo} onDismiss={handleDismissSheet} />
      )}
    </main>
  );
}
