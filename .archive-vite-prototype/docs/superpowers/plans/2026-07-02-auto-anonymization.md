# Auto-Anonymization Modal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time privacy modal that lets Inline nudges users enable category-based auto-anonymization for all messages in the current browser session.

**Architecture:** A focused `AutoAnonymizationModal` component renders the dialog and category toggles. `Composer` owns the temporary preference, limits the modal and privacy-based Send colors to `privacyMode === 'inline'`, and reuses its existing secured-finding state before forwarding the message to the mock chat flow.

**Tech Stack:** React 19, Vite 5, existing CSS theme variables

---

## Chunk 1: Modal And Behavior

### Task 1: Build the modal component

**Files:**
- Create: `src/components/AutoAnonymizationModal.jsx`
- Modify: `src/styles.css`

- [x] **Step 1: Create the accessible dialog structure**

Add a fixed backdrop, a compact dialog with the approved heading, four category rows, switches, and the two approved actions.

- [x] **Step 2: Add interaction details**

Support toggle changes, backdrop dismissal, Escape dismissal, initial focus, and keyboard-operable controls.

- [x] **Step 3: Style and animate the modal**

Use the existing theme variables, restrained sizing, a subtle fade/scale entrance, clear switch states, and a mobile-safe width.

### Task 2: Connect the modal to Send

**Files:**
- Modify: `src/components/Composer.jsx`

- [x] **Step 1: Add session preference state**

Track whether auto-anonymization has been enabled and the enabled category keys (`person`, `contact`, `location`, `time`).

- [x] **Step 2: Route risky sends through the modal**

Analyze immediately on Send so rapid sends are covered. Open the modal only when unresolved findings exist and auto-anonymization has not been configured.

- [x] **Step 3: Implement both modal actions**

`Turn on` stores the selected categories, marks matching findings protected using the existing green state, and sends. `Send without anonymizing` sends unchanged without storing a preference.

- [x] **Step 4: Handle later messages**

When auto-anonymization is already enabled, automatically protect findings from enabled categories and send without reopening the modal.

- [x] **Step 5: Restrict the feature to Inline nudges**

Require Inline nudges mode before opening the modal or applying red/green Send colors. Close the modal if the user changes to another version.

## Chunk 2: Verification

### Task 3: Verify behavior and presentation

**Files:**
- Verify: `src/components/AutoAnonymizationModal.jsx`
- Verify: `src/components/Composer.jsx`
- Verify: `src/styles.css`

- [x] **Step 1: Run the production build**

Run: `npm run build`

Expected: Vite finishes successfully with no compilation errors.

- [x] **Step 2: Test first-time risky Send in the browser**

Enter text containing a detected name and location, press Send, confirm the dialog appears with all switches on, then turn one category off.

- [x] **Step 3: Test both actions**

Confirm `Turn on` sends and suppresses the modal for later risky messages. Reload and confirm `Send without anonymizing` sends but causes the modal to appear again on the next risky message.

- [x] **Step 4: Test dismissal and responsive layout**

Confirm Escape and backdrop click close without sending, focus is placed in the dialog, and the layout fits desktop and mobile viewports without overlap.

- [x] **Step 5: Test version isolation**

Confirm Inline nudges retains both features, while Privacy grade and Privacy color use the normal Send button and send directly without opening the modal.

## Chunk 3: Category Information Tooltips

### Task 4: Add accessible category explanations

**Files:**
- Modify: `src/components/AutoAnonymizationModal.jsx`
- Modify: `src/styles.css`

- [x] **Step 1: Add category descriptions and info controls**

Store the approved one-line description with each category and render a Lucide info icon button beside the category name.

- [x] **Step 2: Add pointer, keyboard, and tap behavior**

Open one tooltip at a time on hover, focus, or tap. Close it on pointer leave, focus loss, outside interaction, or Escape without closing the modal.

- [x] **Step 3: Style the tooltip**

Use a compact dark tooltip with a small pointer, readable type, and positioning that stays inside the modal on desktop and mobile.

- [x] **Step 4: Verify the production build**

Run: `npm run build`

Expected: Vite finishes successfully with no compilation errors.

- [x] **Step 5: Verify interactions in the browser**

Confirm every category's text, hover/focus/tap behavior, Escape behavior, and desktop/mobile placement. Confirm toggles and modal actions still work.

## Chunk 4: Session Anonymisation Control

### Task 5: Add the lock control and anchored menu

**Files:**
- Create: `src/components/AnonymizationControl.jsx`
- Modify: `src/components/Composer.jsx`
- Modify: `src/styles.css`

- [x] **Step 1: Separate configured and enabled state**

Track whether setup has ever been completed separately from whether auto-anonymisation is currently on. Turning the setting off must preserve category choices and bypass both anonymisation and the setup modal.

- [x] **Step 2: Build the lock control**

Render a Lucide locked or unlocked icon beside Attach only after setup and only in Inline nudges. Give the control a clear accessible label for its current state.

- [x] **Step 3: Build the anchored menu**

Open a compact menu above the lock control with an "Anonymisation" label and switch. Support trigger toggling, outside dismissal, Escape dismissal, and keyboard focus.

- [x] **Step 4: Style active and inactive states**

Use green for the enabled lock, a restrained neutral state for the unlocked icon, existing theme variables for the menu, and mobile-safe dimensions.

- [x] **Step 5: Verify build and behavior**

Run `npm run build`, then verify setup reveals the control, the icon and switch track each other, off sends directly without reopening setup, on resumes automatic behavior, category choices remain intact, and other prototype versions do not show the control.

Desktop behavior passed. The in-app browser became unresponsive during the mobile viewport override, so mobile visual verification could not be completed in this run.

## Chunk 5: Highlight Visibility And Detailed Settings

### Task 6: Add anonymized-word visibility preferences

**Files:**
- Modify: `src/components/AutoAnonymizationModal.jsx`
- Modify: `src/components/AnonymizationControl.jsx`
- Modify: `src/components/Composer.jsx`
- Modify: `src/styles.css`

- [x] **Step 1: Add modal modes and the checkbox**

Reuse the modal for setup and settings modes. Add the "Show anonymized words" checkbox, use the correct headings/actions for each mode, and keep its setup default off.

- [x] **Step 2: Add saved and draft settings state**

Store saved categories and checkbox preference separately from modal drafts. Setup commits with Turn on; settings commits with Save changes; Cancel, Escape, and backdrop dismissal discard draft edits.

- [x] **Step 3: Add the gear entry point**

Place a Lucide gear button beside the session toggle in the lock menu. Opening it closes the menu and launches settings with current saved values.

- [x] **Step 4: Apply highlight visibility rules**

While auto-anonymisation is on, never render red privacy highlights. Render selected findings green only when Show anonymized words is checked. Restore normal red highlights when auto-anonymisation is off.

- [x] **Step 5: Style checkbox and settings actions**

Keep the modal compact, make the checkbox clearly distinct from category toggles, and preserve desktop/mobile bounds.

- [x] **Step 6: Verify build and browser behavior**

Run `npm run build`. Verify default-hidden highlights, optional green highlights, red restoration while off, gear/settings access, Save persistence, Cancel rollback, and unchanged setup/send behavior.

## Chunk 6: Intrinsic Session Menu Width

### Task 7: Make the session menu hug its content

**Files:**
- Modify: `src/styles.css`

- [x] **Step 1: Replace fixed width with intrinsic sizing**

Use `width: max-content` with a viewport-aware maximum and prevent the single menu row from wrapping.

- [x] **Step 2: Build and verify rendered dimensions**

Run `npm run build`, open the menu in the browser, and confirm its rendered width is driven by content rather than the previous 190px declaration.
