# UX Feedback — GDAP: Management layout cramped at 80% zoom

**Area**: Operations → Microsoft → Reseller: Customer Onboarding → GDAP: Management  
**Context**: The app uses the new UX/DesignSystem (Mantine-native) guidelines.  
**Date**: 2026-01-20  
**Author**: Neil Bolton / Cursor agent notes consolidated

---

## Executive summary

The GDAP: Management page felt **cramped** even at **80% zoom** due to a combination of:

- **Inconsistent layout primitives** (mix of `Card` + raw DOM layout + manual grids) → spacing/rhythm not governed by a single scale.
- **Non-wrapping action rows** → controls compress instead of wrapping cleanly.
- **Unbounded table cell content** (especially “Roles”) → rows balloon vertically or squeeze columns horizontally.

The fix was primarily structural: use consistent DS/Mantine layout primitives (`Stack`, `SimpleGrid`, wrapping `Group`s), and apply a standard “long cell” strategy in tables (truncate + reveal via tooltip).

---

## Repro (what we saw)

1. Open `GDAP: Management`
2. Set browser zoom to **80%**
3. Observe:
   - Cards appear tight/stacked with minimal breathing room.
   - Action clusters (filters/buttons) compress.
   - Templates table rows become extremely tall because the **Roles** cell renders a long comma-separated list.

---

## Before / After screenshots

### Before

![Before — templates table rows are forced tall by unbounded Roles cell](./before-templates.png)

### After

![After — roles are summarized (+N more) and full list is available via tooltip; table scrolls horizontally when needed](./after-templates.png)

---

## Root causes (diagnosis)

### 1) Mixed layout primitives (page flow not standardized)

- The page was not consistently using the same “page flow” primitive as the UX repo (e.g., `Stack gap="xl"`).
- Result: vertical rhythm depended on ad-hoc margins and could look tight under zoom/width pressure.

### 2) Manual grid for summary cards

- Expiring/Expired cards were laid out with a hand-rolled CSS grid.
- Result: didn’t inherit DS spacing defaults and could feel “packed” relative to the rest of the app.

### 3) Action rows didn’t wrap

- Some `Group` clusters were effectively fixed to one line.
- Result: at narrower widths/zoom changes, they compress instead of wrapping.

### 4) Tables had no “long content” policy

- “Roles” rendered as a long, comma-joined string.
- Result: huge rows (wrap) or tight column squeeze (no wrap), both of which read as “cramped”.

---

## Changes applied (implementation)

### A) Standardize page flow on `Stack`

- Use `Stack component="main" gap="xl"` to enforce consistent section spacing.
- Keep sections as `Card`s within the flow.

**Reference**: `src/pages/OperationsGDAPManagement.tsx`

### B) Replace manual grid with `SimpleGrid`

- Use Mantine `SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md"` for the Expiring/Expired cards.

### C) Allow action rows to wrap

- Add `wrap="wrap"` to `Group` rows that contain multiple controls (filters + badges + buttons).

### D) Add a “long cell” pattern for tables (Roles + Description)

- Wrap the table in `overflowX: auto` (prevents column squeeze).
- `Description`: clamp to 2 lines.
- `Roles`: show `first two roles + (+N more)` with tooltip showing full list (newline-separated) on hover.

---

## Recommendations for the UX repo (actionable)

### 1) Add a “Page Flow” guideline (P0)

- **Rule**: main content should use `Stack gap="xl"` (or a DS wrapper) as the default.
- **Why**: keeps vertical rhythm consistent across pages and resilient to zoom.

### 2) Add a “Card Dashboard Grid” guideline (P0)

- **Rule**: use `SimpleGrid` for dashboard cards; avoid manual CSS grids in feature pages.

### 3) Add an “Action Row” guideline (P0)

- **Rule**: action clusters must be wrapping by default:
  - `Group justify="space-between" wrap="wrap"`
  - nested `Group wrap="wrap"` for control clusters

### 4) Add a “Table Long Content Policy” (P0)

- **Rule**: tables must define how long strings/lists behave.
  - lists → summary + tooltip (or expandable detail)
  - descriptions → `lineClamp`
  - optional → `overflowX: auto` wrapper if many columns

### 5) Buttons: forbid “appended text hacks” (P1)

- **Rule**: button labels should be plain text; icons should use `leftSection`/`rightSection` consistently.

---

## Proposed reusable components (nice-to-have)

- **`PageSectionStack`**: wrapper for `Stack gap="xl"` used by feature pages.
- **`CardGrid`**: wrapper for `SimpleGrid` with DS defaults.
- **`HeaderActionRow`**: standard “title + actions” row with wrapping behavior.
- **`LongCell`**: helper for `lineClamp` + tooltip summarization patterns.

---

## Repo references (for engineers)

- **Fix commit**: `e52aaba` (`chore(gdap): improve spacing + prevent cramped templates table`)
- **File**: `src/pages/OperationsGDAPManagement.tsx`

