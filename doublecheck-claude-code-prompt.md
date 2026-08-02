# DoubleCheck Prototype — Claude Code Build Prompt

## Setup steps (do this first, in Terminal)

```
cd "/Users/phuongvyhuynh/Desktop/CCA/Summer 2026/Social Lab/DoubleCheck"
git clone https://github.com/jon549design-hub/SocialLabInputFieldPrototype.git .
claude
```

The `.` at the end of the clone command tells git to clone directly into the DoubleCheck folder itself rather than creating a new subfolder inside it. If the folder already has files in it (even an empty `.git` folder from a prior attempt), git will refuse to clone into it, in that case delete everything inside the folder first and try again, or clone into a temporary folder and move the contents over.

If `claude` doesn't launch, Claude Code isn't installed yet, install it first from claude.com/claude-code, then run `claude` again from inside that same folder.

Once Claude Code opens, paste everything below the line as your first message.

---

## Prompt to paste into Claude Code

I'm building a clickable prototype called **DoubleCheck**, an OS-level privacy feature that detects sensitive personal data (name, location, health, financial info) in any text input field and lets the user anonymize it before sending. It is being pitched as a native addition to iOS and macOS, living inside Settings > Privacy & Security, not as its own standalone app.

This is a design prototype for user testing, not a real system integration. Build it as a **Next.js (App Router) web app styled to closely replicate Apple's iOS and macOS design systems**, deployable to Vercel via git push. No native code, no Xcode.

### Tech stack
- Next.js (App Router), TypeScript
- Tailwind CSS, with a custom config extending Apple's actual tokens (see below)
- Framer Motion for sheet presentations and the text-to-placeholder transform animation
- React Context + localStorage to persist onboarding choices across screens (this is required, see "State" section below)
- No backend, no database, everything is client-side and scripted

### Design tokens to configure in Tailwind
- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif`
- iOS colors: `systemBackground` (#FFFFFF / #000000 dark), `secondarySystemBackground` (#F2F2F7 / #1C1C1E dark), `label` (#000000 / #FFFFFF), `secondaryLabel` (#3C3C43 at 60% opacity), `systemBlue` (#007AFF), `systemRed` (#FF3B30), `systemGreen` (#34C759), separator (#3C3C43 at 29% opacity)
- macOS colors: window background (#ECECEC light / #282828 dark), sidebar background (#F5F5F5), traffic light red #FF5F57, yellow #FFBD2E, green #28C840
- Corner radii: iOS cards and sheets 14–20px, macOS windows 10px, iOS buttons/pills fully rounded
- Support light and dark mode via `prefers-color-scheme` from the start

### Working from the previous prototype's repo
This folder is already a clone of the repo from the last round of this project (https://github.com/jon549design-hub/SocialLabInputFieldPrototype.git), so we keep one version history across both prototype rounds rather than starting a new repo. Look at what's already here before scaffolding anything new. Add a **device switcher** (a small pill toggle or segmented control, top right of the screen, outside the simulated device itself) that lets me flip between "iPhone" and "Mac" views of the same screen at any point in the flow, rather than relying only on browser width. Keep both shells mounted in the same route so switching is instant, no reload, no lost state.

### Two device shells to build as reusable components
1. **`<MacWindow>`** — replicates a macOS System Settings window: traffic-light buttons top left, back/forward chevrons, sidebar list with icon + label rows (rounded-square colored icon backgrounds, like Bluetooth/Network/Battery in System Settings), and a scrollable detail pane on the right with grouped rows and chevrons. Reference: standard macOS System Settings > Privacy & Security layout.
2. **`<IPhoneShell>`** — replicates an iPhone screen: status bar (time, signal, battery), a nav bar with back chevron + title, and an `.insetGrouped`-style list (rounded rectangle groups, thin separators between rows, chevrons on navigable rows), plus a home indicator bar at the bottom. Wrap the whole app content in a phone-frame border so it's obviously being viewed as a simulated device on a laptop screen, and render full-bleed with no phone frame on an actual mobile browser (use a media query or viewport check).

### The five-act structure (build as five routes)
Each act is a scripted step, not a fully generalized OS. Hardcode the navigation path.

**1. `/entice`**
Opens on a lock-screen-style notification: "Software Update available: DoubleCheck is here." Tapping it goes to `/enter`. If the user dismisses it instead, show a smaller reminder banner the next time they "open" the Messages screen later (script this as a one-time flag in state, not a real notification system).

**2. `/enter` (Settings list)**
Render inside `<MacWindow>` on desktop and `<IPhoneShell>` on mobile viewports. Recreate the Privacy & Security list layout exactly as in the reference screenshot: rounded-square colored icon, title, subtitle/count, chevron. Add a new "DoubleCheck" row near the top with its own icon and color. Tapping it opens onboarding.

**3. `/onboarding` (multi-step, this is where most of last round's feedback lives)**
- **Step 1 — explain anonymization before anything else.** Before showing any settings, show one short screen with a plain-language example: an animated before/after showing a sentence like "My name is Alex and I live in Seattle" transforming into "My name is [Protected] and I live in [Protected]." Label the control throughout the product as **"Protect"** (e.g. "Protect this," "Protection settings"), and use the word "anonymize" only once, in a small parenthetical or info-icon tooltip, so testers get the plain-language handle first.
- **Step 2 — category selection.** List categories (Name, Location, Health, Financial, Contacts, etc.) as an **accordion**, not a modal, each row expandable to show sub-items. Include a **"Select all"** checkbox at the top. Each category checkbox should show three visual states: unchecked, indeterminate (dash, meaning some but not all sub-items selected), and fully checked. This directly fixes tester confusion between "some selected" and "all selected."
- **Step 3 — a short explainer of what happens live**, i.e., "When DoubleCheck spots one of these while you type, it'll highlight it. Tap the highlight to protect it." Include a tiny static preview of the highlight + tap-to-protect interaction so it's not a surprise later.
- Save all of this to shared state/localStorage. This state must be read by the Engage screens, not just displayed once.

**4. `/engage` (the core interaction, build a small home screen plus multiple contexts)**
- **A `<HomeScreen>` component** styled like an iOS/macOS home screen or launcher, showing a small grid of app icons: Messages, a search/browser app, and two or three generic AI chatbot app placeholders. Use simple, original rounded-square icons with a glyph and a flat color for each, not scraped or copied logos of real products, see the note below on why.
- **A `<MessageThread>` component** styled like Messages (bubble layout, timestamp, input bar with a rounded text field and send arrow).
- **A `<BrowserBar>` component** styled like Safari's address/search bar (rounded pill, compass icon, cancel button), used for a Google-style search input.
- **A `<ChatAppInput>` component**, reused for each generic AI chatbot placeholder, styled as a simple chat interface: a scrollable message history area and a rounded input field with a send button at the bottom. Tapping any chatbot icon on the home screen opens this same component with a different app title/color, so the underlying detection logic and the input field itself work identically no matter which "app" it's opened in. **Before building these, look at how this repo already differentiates its chatbot placeholders visually, accent color, name, icon shape, header style, and match that same pattern here** so the two rounds feel like one consistent product rather than a restart. Give each placeholder its own invented name and accent color (not real product names or logos, see the note below), distinct enough that a tester can immediately tell they're in a different app just from the header and color, even though the input field behavior underneath is identical.
- Across all of these (Messages, search, and every chatbot instance), as the user types, scan the text against the categories they actually selected in onboarding, not a hardcoded list. Highlight matches inline with an underline or background tint. The detection and highlighting behavior must be identical everywhere it appears, since the whole point of DoubleCheck is that it works the same across every input field on the device, not just inside one app.
- **Tapping a highlighted term opens a bottom sheet** (Framer Motion slide-up, matching iOS sheet physics with rounded top corners and a grabber handle), not a color change alone. The sheet shows the detected value and a "Protect" button.
- Confirming protection **visibly animates** the original text morphing into a placeholder chip (e.g. "[Protected — Location]"), so the transformation is obviously legible, not just a subtle recolor.
- On first use only, show a small **legend** near the input explaining what red (detected, not yet protected) and green (protected) mean. Make it collapsible/dismissible after the first view, and persist that dismissal in state.
- Add a persistent small line of copy near the input: "Processed on this device. Nothing is sent anywhere until you choose to protect it." This should read as calm reassurance, not a legal disclaimer.
- Do **not** include any grading, scoring, or letter-grade feature anywhere in this build.

**A note on app icons:** don't scrape or reproduce real companies' logos (ChatGPT, Claude, etc.) for these placeholder icons. Design simple original icons instead (a rounded square with a plain glyph and a color is enough to read as "a chat app" in a demo). This keeps the prototype safe to show and share without any trademark or copyright concerns.

**5. `/exit`**
Back in Settings > DoubleCheck, a toggle to turn the whole feature off. Toggling it off should visibly stop highlighting if the tester goes back to `/engage` afterward (read the same shared state).

**6. `/extend`**
Returning to the DoubleCheck settings page later to reorder or edit selected categories, and see the change reflected live back in `/engage`. This is the screen that proves onboarding and detection are actually one connected system, not two.

### State management requirement
Use a single React Context (e.g. `DoubleCheckProvider`) wrapping the whole app, persisted to localStorage, holding: selected categories (with sub-item granularity), feature on/off state, and whether the legend/tooltips have been dismissed. Every screen reads from and writes to this one source of truth. Do not fake this with separate local state per screen, that's the exact bug from the last prototype round.

### What to build first
Build and show me one screen at a time in this order: `/entice` → `/enter` → `/onboarding` (all three steps) → `/engage` with `<MessageThread>` only → `/exit` → `/extend` → then add `<BrowserBar>` to `/engage` last. Pause after each screen so I can review before moving on.

### Deployment
Set up the project so I can `git init`, push to a GitHub repo, and import it directly into Vercel for automatic deploys on every push. No environment variables or backend services needed.

---
