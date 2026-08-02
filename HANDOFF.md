# DoubleCheck — Session Handoff

Clickable prototype of **DoubleCheck**: an OS-level iOS/macOS privacy feature that detects
sensitive personal data in any text field and lets the user protect it before sending.
Class project — not for public distribution yet. **Not pushed to git / not deployed.**

## Stack
Next.js App Router + TypeScript, Tailwind v4, Framer Motion. `npm run dev` → localhost:3000
(`.claude/launch.json` config name: `doublecheck`).

## Repo history
Cloned from an earlier Vite+React round of this same project. Converted to Next.js.
Old code kept (not deleted) at `.archive-vite-prototype/` — useful reference for the
Claude/ChatGPT composer styling and the 9-category taxonomy (`onboardingData.js`), both
already ported into the new app.

## Routes (all built + verified in browser)
- `/entice` — lock-screen/notification-center "Software Update" banner → `/enter`
- `/enter` — Privacy & Security settings list, DoubleCheck row → `/onboarding` (first time) or `/extend`
- `/onboarding` — 3 steps: explain "Protect", category accordion + protection-mode picker, live-detection preview
- `/engage` — the core flow: Home screen (iOS grid+dock) → Messages / Safari / Claude / ChatGPT / Settings
- `/exit`, `/extend` — both render the same `DoubleCheckSettingsPage` (toggle, protection mode, categories)

## Core architecture
- **`src/context/DoubleCheckProvider.tsx`** — global state, persisted to localStorage:
  `selection` (per-subitem bools), `featureOn`, `protectionMode` (`review`|`auto`),
  `onboardingComplete`, `enticeDismissedOnce`, `legendDismissed`, `deviceMode` (`iphone`|`mac`), `categoryOrder`.
- **`src/lib/detection.ts`** — heuristic keyword+regex matcher (not real NLP, documented as such).
  `detect(text, selectedSubItemIds)` → `Match[]`; `protectAllMatches()` bulk-applies placeholders.
- **`src/data/categories.ts`** — 9 categories (financial, identity, health, thoughts, location,
  relationships, work, creative, preferences), ported from the archived prototype's taxonomy.
- **Device chrome** (`src/components/device/`): `IPhoneShell` (Dynamic Island, swipe-up-from-home-
  indicator gesture via Framer Motion drag — no fake "Back to Home" button), `MacWindow` (now
  internally wrapped by `MacBookFrame` for full laptop mockup: menu bar + camera notch + deck),
  `MacDock` (persistent, click any icon to switch apps directly — no home detour, matches real macOS),
  `DeviceStage` (mounts both iPhone/Mac trees simultaneously, toggles via `deviceMode`).
- **Engage screens** (`src/components/engage/`): `HomeScreen`, `MessageThread` (iMessage skin),
  `AIChatScreen` (shared Claude/ChatGPT skin, `productTheme`-driven), `BrowserBar` (Safari-style),
  `ProtectSheet` (iPhone bottom sheet), `ProtectPopover` (Mac Grammarly-style anchored popover),
  `ProtectableInput` (core dual-layer textarea+highlight+click-hotspot input), `useAutoProtect` hook.

## Key product decisions from this session
1. **Two protection modes**, chosen in onboarding step 3 and editable in settings:
   "Review each time" (tap-to-protect) vs "Auto-protect" (silent redaction — but a match still
   touching the very end of the text is left alone until the user moves past it or sends, so it
   never mangles a word mid-type; a send-time sweep catches stragglers).
2. **Real Claude/ChatGPT branding is intentional** — user explicitly authorized this ("class
   project, don't worry about the credit thing") after I flagged the original brief's
   don't-use-real-logos instruction. Used original abstract marks (`ClaudeMark`/`ChatGPTMark` in
   `components/icons/ProductMarks.tsx`, ported from the archived prototype), not real logo assets.
   Browser is named "Safari" (renamed from a generic "Compass" placeholder), also explicit.
3. **Monochrome category icons** (gray/black) per explicit request — but Dock/Home app icons stay
   colorful, matching how real iOS actually renders app icons.
4. **iOS navigation**: swipe-up-from-home-indicator gesture (drag + commit threshold/velocity +
   rubber-band spring-back) replaces a fake "Back to Home" nav button.
5. **macOS navigation**: no "home screen inside a window" — empty Desktop + persistent Dock,
   click any icon to jump directly to that app (no home detour), matching real macOS.
6. **DoubleCheckSettingsPage**: Protection Mode + category list animate-collapse when the
   DoubleCheck toggle is off.

## Known limitations / things not yet done
- No per-app override of protection mode — it's one global setting.
- BrowserBar's "search results" are decorative skeleton placeholders, not real content.
- Dark mode tokens exist in `globals.css` but `DoubleCheckProvider` currently forces
  `data-theme="light"` unconditionally — no UI control wired to toggle it yet.
- Detection is heuristic (keyword/regex), not real NLP — expect occasional false positives/negatives.
- Not pushed to git, not deployed — explicit user instruction to hold off.

## If continuing in a new session
Read this file first, then skim `src/app/engage/page.tsx` (the most complex route — ties
together Home/Messages/Safari/Claude/ChatGPT/Settings + protect flow + auto-protect sweep) and
`src/context/DoubleCheckProvider.tsx` (all shared state). Dev server: `npm run dev`.
