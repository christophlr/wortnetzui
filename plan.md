# Wortnetze — Comprehensive Modularization & i18n Plan

## Context

The project has reached a maturity point where iteration without structure is producing drift:

- The right-panel "Inspector" already has a strong atomic-component foundation (`InspectorAtoms.tsx`, 9 primitives, ~85% adoption in tabs). The rest of the UI (TopBar, Toolbar, Timeline, Preview, dialogs) is still hand-rolled — repeated styling stacks, ~15 hardcoded hex colors, switch/active colors that vary by tab (indigo / emerald / blue / zinc with no rule), and ad-hoc spacing overrides.
- **The atomic foundation that exists is itself incoherent** in three concrete ways: (1) `InspectorSliderControl` renders single-property labels as `<h3>` — semantically wrong; an `<h3>` should be a real subgroup of multiple controls, not a property name. (2) Atom inventory has gaps that force tabs to hand-roll fallbacks — there is no toggle-row atom, no color-field atom, no keyframe-toggle atom — so any time a tab needs one, the styling drifts. (3) Naming is jargon-y and inconsistent with the user's Figma reference (Figma uses "section / group / row / label"; the codebase uses "Section / Subgroup / SubgroupTitle / ControlLabel"). `InspectorControlLabel` is defined but used once. `InspectorTabGroup` is defined and never used. `SliderValue` (the click-to-edit numeric editor) lives in `Inspector.tsx`, not in atoms.
- Terminology has drifted: the component file is `Inspector.tsx`, the context state is `isSidebarOpen` / `inspectorWidth` (mixed), and the user-facing concept is "Sidebar". Tab IDs are English (`'visual'`, `'physics'`) but display titles are German ("Visualisierung", "Physik") with no mapping table — the relationship is implicit and scattered.
- ~130–150 German UI strings are hardcoded across 11 component files with zero i18n infrastructure. The constraint "UI must be German" in `STYLE_GUIDE.md` / `AGENTS.md` blocks future language work and makes copy edits painful.
- Orphan / archived files exist: `bulkAppPatch.cjs`, `fixRedo.cjs`, `patch.diff`, `default_shadcn_theme.css`, `guidelines/`, three unused shell files (`AppShell.tsx`, `AppCanvas.tsx`, `AppSidebar.tsx`), one unused atom (`InspectorTabGroup`), ~15 unused shadcn components, and dual lockfiles (`package-lock.json` + `pnpm-lock.yaml`).
- **Documentation has structural problems beyond drift.** A full audit revealed:
  - `ARCHITECTURE.md` Section 2 ("Data Flow & State Architecture") is **literally truncated mid-sentence at line 56** — the doc claims a section exists; the content does not.
  - `ROADMAP.md` is a placeholder containing the literal string *"`*(... keep the rest of your ROADMAP.md exactly as it is...)*`"* — the document was never finished.
  - `CLAUDE.md` and `GEMINI.md` are 2-line stubs that just redirect to `AGENTS.md` — pure noise.
  - `guidelines/Guidelines.md` duplicates `AGENTS.md`'s routing.
  - `AGENTS.md` constraint *"App.tsx must remain a slim layout composer"* is contradicted by the actual 380-line `App.tsx`.
  - `AGENTS.md` constraint *"Always maintain the German language as the default"* contradicts the planned i18n switch.
  - `ATTRIBUTIONS.md` is missing Three.js, Radix UI, Tailwind, and the Space Grotesk font — a real licensing gap.
  - `STYLE_GUIDE.md` "Locked Visual Baseline" table has 33 rows of hardcoded hex values with no CSS-variable names alongside, no enforcement, and unclear update protocol.
  - Ownership is circular: `PROJECT.md` says "do not look for standing orders here", but `AGENTS.md` says "update PROJECT.md after code changes" — each defers to the other.
  - The `inspector-atom-maintenance` Copilot agent + its prompt + skill files all hardcode the "Inspector" name and will rot the moment the rename lands.

**Desired end state:** every UI surface composes from shared atoms with a clear `Sidebar → Tab → Section (H2) → Subgroup (H3) → Control row` cascade; code uses English identifiers; German is the displayed default but loaded from translation files; a menu-bar switch toggles language; orphan files are removed; documentation reflects the new structure.

---

## Confirmed decisions

| Decision | Choice |
|---|---|
| Component naming | `Inspector` → `Sidebar`. Alias shadcn's primitives as `Shad*` where used (≈5 import lines). |
| i18n library | `i18next` + `react-i18next` with `i18next-browser-languagedetector` (added later for auto-detect). |
| Plan format | Single comprehensive plan (this document). |
| Code language | English: identifiers, variables, props, tab IDs, file names. |
| UI default language | German (preserved). English available immediately via the new switch. |
| Orphan shell files (`AppShell.tsx`, `AppCanvas.tsx`, `AppSidebar.tsx`) | Activate in Phase 2 (refactor `App.tsx` to compose them — aligns with `AGENTS.md` "App.tsx is a slim layout composer" rule). |

---

## Execution methodology (commit gates + model selection)

### Commit-gate rule

Every sub-step below is bounded by **three checkpoints before commit**:

1. **Build green** — `npm run build` exits 0.
2. **Smoke test** — `npm run dev`, open the affected surface in the browser, verify it renders and the key interactions work. Take ≤30 seconds.
3. **Visual parity** — quick eyeball comparison against the locked baseline (STYLE_GUIDE table). Pixel changes only where the plan explicitly authorizes them.

If a sub-step fails any of the three, **stop and fix before continuing** — do not stack broken changes. Commit message format: `phase<N>.<letter>: <one-line summary>` (e.g. `phase2.j: refactor ContentTab to SidebarGroup + SidebarRadioRow`).

The total plan is ~60 small commits. If a sub-step ever feels like it needs more than ~30 minutes of focused work, it's too big — split it before starting.

### Model selection + effort level guide

Three models are appropriate for this refactor. Switch with `/model` between turns. Higher effort = more thinking time per response, more credits.

| Task type | Model | Effort | Why |
|---|---|---|---|
| Architectural decisions, atom API design, doc rewrites that require judgment, debugging unexplained breakage | **Opus 4.7** | **max** (fast mode on) | Real judgment, no good cheaper substitute |
| Hard tab refactors that may surface design questions (VisualTab, CameraTab, Activate shell) | **Opus 4.7** | **high** | Cheaper than max but still thoughtful |
| Pattern-following work — renames, mechanical extraction following an established atom, replacing literals with `t()` calls | **Sonnet 4.6** | **medium** | ~5× cheaper than Opus, fully capable |
| Tricky mechanical work where one mistake cascades (the hardcoded-color sweep, the imports rename) | **Sonnet 4.6** | **high** | Worth one notch up |
| Trivial single-file or single-line fixes, deletions, lint cleanup, file moves with no logic changes | **Haiku 4.5** | **minimal** | Cheapest tier, plenty for this |
| Verification / smoke-test reasoning ("does this still match the baseline?") | **Sonnet 4.6** | **medium** | Reading-heavy, not thinking-heavy |

Each numbered subsection in the phases below (1.1, 1.2, 2.1, 2.2, …) carries a *suggested model + effort* tag inline. **These are non-binding recommendations**, not rules — if Sonnet stalls or starts hand-waving, escalate to Opus on the next turn; if a step turns out to be more mechanical than expected, drop to Haiku.

Within a subsection that touches many files (e.g. *4.2 String extraction* spans 11 files), commit per file, not per subsection. The "ordering inside X.Y" notes at the end of each phase suggest the safest file order.

**Rule of thumb:** plan with Opus, execute with Sonnet, escalate to Opus only when Sonnet hits a fork in the road. Expect ~3–4× cost reduction versus running Opus on every turn while preserving quality where it matters.

---

## Vocabulary contract (single source of truth)

Add a new file `src/app/components/sidebar/sidebarConfig.ts` exporting the canonical mapping. Every component reads from this, never duplicates the literal:

| Tab ID (code) | EN title (code default) | DE title (translation key `sidebar.tab.<id>.title`) | Header H1 (caps) |
|---|---|---|---|
| `content` | Content | Inhalt | INHALT |
| `visual` | Visual | Visualisierung | VISUALISIERUNG |
| `physics` | Physics | Physik | PHYSIK |
| `camera` | Camera | Kamera | KAMERA |
| `canvas` | Canvas | Canvas | CANVAS |

The H1 in the panel header is the uppercased translated title — no separate "tab label vs displayed title" strings.

A second new file `VOCABULARY.md` at the repo root mirrors this mapping for *every* user-visible string in the app, organized by surface (sidebar / topbar / toolbar / timeline / dialogs). Each row: `<code key>  |  <EN text>  |  <DE text>  |  <surface>`. This is the artifact i18n bundles are generated from and the single answer for "what does this variable display as".

---

## Atomic hierarchy correction (replaces the current pattern)

The deep audit produced a corrected hierarchy that the rest of the plan assumes. The headline change: **drop the H3 for single-property labels.** An `<h3>` is reserved for groups that contain multiple controls. A standalone "Basis-Skalierung" slider is not a subgroup — it is a row.

### Corrected cascade

| Level | DOM element | What it is | Atom name (new) | Old atom |
|---|---|---|---|---|
| 1 | `<h1>` | Tab title, displayed in the sidebar header (uppercased) | `SidebarTabHeader` | inline in `Inspector.tsx` line 274 |
| 2 | `<h2>` | Major section in a tab — "Knoten", "Verbindungen", "Umgebung", "Kräfte" | `SidebarSection` (compound: header + body slots) | `InspectorPanelSection` + `InspectorSectionHeader` (collapsed into one) |
| 3 | `<h3>` | True subgroup — a named cluster of 2+ related controls (e.g. "Form" with three shape buttons, "Atmosphäre-Gradient" with two color fields). **Never used for a single control.** | `SidebarGroup` (header + body slots) | `InspectorSubgroup` + `InspectorSubgroupTitle` |
| 4 | `<div>` | **One full control block** — everything that belongs to a single parameter. Vertically stacked: a header row, the control body, and an optional description. The header row contains: label-left (`<span>`, **not** `<h3>`) + value-chip-and-accessory-right. The control body is whatever widget the parameter uses (slider track, switch, input, color picker, button group, radio set). The description, if present, sits underneath in helper-text style. *This is the block your screenshot shows: "Streuung (Abstoßung)" label + value + keyframe → slider → "Wie stark Elemente sich gegenseitig verdrängen."* | `SidebarSliderRow`, `SidebarToggleRow`, `SidebarColorRow`, `SidebarRadioRow`, `SidebarButtonGroupRow` — all share the same vertical-stack grammar via a shared `SidebarRow` skeleton. Each accepts `label`, `value`, `accessory`, `body`, `description` props. | `InspectorSliderControl` (mis-using `<h3>` for the label) |
| 5 | inline | **The pieces that fill the slots of a level-4 block.** None of these stand alone; they're inserted into a level-4 control via its props. The value chip, the keyframe accessory, the slider primitive, the click-to-type number editor, the description `<p>`. | `SidebarValueChip`, `SidebarKeyframeToggle`, `SidebarSliderTrack`, `SidebarEditableNumber` (extracted from the orphaned `SliderValue` in `Inspector.tsx`), `SidebarDescription` (a one-line atom for the helper-text styling) | scattered |

Practical consequences:

1. **`SidebarSliderRow`'s label is a `<span>`, not an `<h3>`.** Fixes the semantic bug in `InspectorSliderControl` at line 98.
2. **`SidebarGroup` (the H3-level atom) is only reached for actual groupings of multiple controls.** "Form" (3 shape buttons) keeps it. "Basis-Skalierung" (a single slider) loses it.
3. **The description in your screenshot is level 5** (a `SidebarDescription` atom, just helper-text styling), but it lives **inside** the level-4 control block — passed in via the `description` prop. So the answer to your question: slider widget = level 5, description text = level 5, but both belong to the same level-4 control. Level 4 is the container; level 5 is what's inside.

### Naming change (Figma-aligned)

| Old | New | Why |
|---|---|---|
| `InspectorPanelSection` | `SidebarSection` | "Panel" is redundant — the whole thing IS a panel |
| `InspectorSectionHeader` | merged into `SidebarSection` as a `title` prop / `<header>` slot | The two atoms were always used together; coupling them removes a per-tab bug class |
| `InspectorSubgroup` | merged into `SidebarGroup` as a compound component | Same as above |
| `InspectorSubgroupTitle` | `SidebarGroup`'s `title` slot (h3) | No standalone export needed |
| `InspectorControlLabel` | folded into `SidebarRow`'s label slot | Used once in the whole codebase — dead atom |
| `InspectorTabGroup` | **delete** | Never used |
| `SliderValue` (Inspector.tsx 56–102) | `SidebarEditableNumber` atom | Orphaned reusable pattern |

### Variants instead of className overrides

Today `VisualTab.tsx` lines 174 / 255 / 307 pass `className="scale-90 data-[state=checked]:bg-indigo-600"` (and emerald, and zinc) into `<Switch>` directly. That is a code smell — the atom's defaults don't match what the tab wants, so the tab patches them. Replace with explicit variant props on `SidebarToggleRow` (e.g. `tone="accent" | "neutral"`, `size="sm" | "md"`). Tabs never reach past the atom to set Tailwind classes.

### Atom inventory after the correction

Final shape of `SidebarAtoms.tsx`:

```
Shell:    SidebarTabHeader, SidebarActivityButton (icon button in the left rail)
Layout:   SidebarSection (h2 + body), SidebarGroup (h3 + body), SidebarRow (the universal control row)
Rows:     SidebarSliderRow, SidebarToggleRow, SidebarColorRow, SidebarRadioRow, SidebarButtonGroupRow
Inline:   SidebarValueChip, SidebarEditableNumber, SidebarKeyframeToggle, SidebarSliderTrack
Chrome:   SidebarDivider, SidebarInfoBox, SidebarCollapsiblePanel, SidebarDragPuck (for CameraTab pucks)
Total:    16 atoms (down from 9 + ~12 hand-rolled patterns), with 1 deleted (`InspectorTabGroup`) and 2 collapsed via compound APIs.
```

---

## Phase 1 — Rename + semantic baseline + hierarchy fix

**Goal:** the codebase consistently uses "Sidebar" terminology; the cascade is the *corrected* one from the section above (H3 dropped for single controls; compound atoms replace the old Section/Subgroup pair); and tabs no longer reach past atoms to patch classNames.

### 1.1 Atom rewrite (rename + semantic correction)  ·  *suggested: Opus 4.7 / max effort*
File: `src/app/components/inspector/InspectorAtoms.tsx` → move + rewrite to `src/app/components/sidebar/SidebarAtoms.tsx`.

This is not a pure rename — it's a rename plus the hierarchy correction. The mapping:

| Old | New | Notes |
|---|---|---|
| `InspectorTabGroup` | **DELETE** | Unused. |
| `InspectorPanelSection` + `InspectorSectionHeader` | `SidebarSection` (compound: `title`, `actions`, body) | Collapsed; H2 lives on the title slot. |
| `InspectorSubgroup` + `InspectorSubgroupTitle` | `SidebarGroup` (compound: `title`, body) | Collapsed; H3 only on real groups. |
| `InspectorControlLabel` | **DELETE**; label slot becomes part of `SidebarRow` | Used once. |
| `InspectorSliderControl` | `SidebarSliderRow` — label is `<span>`, **not** `<h3>` | Semantic bug fixed. |
| `InspectorSliderTrack` | `SidebarSliderTrack` | Direct rename. |
| `InspectorValueChip` | `SidebarValueChip` | Direct rename. |
| `SliderValue` (currently in `Inspector.tsx` 56–102) | `SidebarEditableNumber` — moves into atoms | Stops being orphaned. |
| (new) | `SidebarTabHeader` (h1) | Replaces inline H1 markup at Inspector.tsx line 274. |
| (new) | `SidebarActivityButton` | Replaces inline `SidebarTab` sub-component. |
| (new) | `SidebarRow` (universal label-left / control-right grammar) | Foundation for the variant rows below. |
| (new) | `SidebarToggleRow` | Replaces the manual `<div className="flex justify-between"><InspectorControlLabel /><Switch /></div>` pattern. |
| (new) | `SidebarColorRow` | Replaces VisualTab's `GradientColorField` placeholder. |
| (new) | `SidebarRadioRow` / `SidebarRadioCard` | Replaces CanvasTab/ContentTab radio styling. |
| (new) | `SidebarButtonGroupRow` | Replaces VisualTab shape selector. |
| (new) | `SidebarKeyframeToggle` | Replaces ad-hoc round indigo button in PhysicsTab. |
| (new) | `SidebarDivider`, `SidebarInfoBox`, `SidebarCollapsiblePanel`, `SidebarDragPuck` | Replaces scattered hardcoded variants. |

### 1.2 Component / file rename  ·  *suggested: Sonnet 4.6 / high effort*

| Old path | New path |
|---|---|
| `src/app/components/Inspector.tsx` | `src/app/components/Sidebar.tsx` |
| `src/app/components/inspector/` | `src/app/components/sidebar/` |
| `…/inspector/VisualTab.tsx` | `…/sidebar/tabs/VisualTab.tsx` |
| `…/inspector/PhysicsTab.tsx` | `…/sidebar/tabs/PhysicsTab.tsx` |
| `…/inspector/ContentTab.tsx` | `…/sidebar/tabs/ContentTab.tsx` |
| `…/inspector/CameraTab.tsx` | `…/sidebar/tabs/CameraTab.tsx` |
| `…/inspector/CanvasTab.tsx` | `…/sidebar/tabs/CanvasTab.tsx` |

### 1.3 Identifier rename across codebase  ·  *suggested: Sonnet 4.6 / medium effort*

| Old | New |
|---|---|
| `Inspector` (component) | `Sidebar` |
| `InspectorProps` | `SidebarProps` |
| `inspectorWidth` (`WortnetzContext`) | `sidebarWidth` |
| `setInspectorWidth` | `setSidebarWidth` |
| `startInspectorResize` (App.tsx + AppSidebar.tsx) | `startSidebarResize` |
| `DEFAULT_INSPECTOR_WIDTH` (constants.ts) | `DEFAULT_SIDEBAR_WIDTH` |

### 1.4 shadcn alias (resolves the name clash)  ·  *suggested: Sonnet 4.6 / medium effort*

In any file that imports shadcn's sidebar primitives (currently `Sidebar.tsx` only):

```ts
import {
  SidebarProvider as ShadSidebarProvider,
  SidebarContent as ShadSidebarContent,
  SidebarHeader as ShadSidebarHeader,
} from '@/components/ui/sidebar';
```

This is the entire collision fix — every place using the shadcn primitive now reads `ShadSidebar*` and our component is the unambiguous `Sidebar`.

### 1.5 Sidebar.tsx structural cleanup  ·  *suggested: Sonnet 4.6 / high effort*

- Move the hand-rolled `<h1 className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">` (line ~274) into a new atom `SidebarTabHeader` so the H1 stops being inline.
- Move the `SidebarTab` icon-button sub-component into `SidebarAtoms.tsx` as `SidebarActivityButton`.
- Read tab title + icon from the new `sidebarConfig.ts` instead of literal switch/conditionals.

**Acceptance:** `grep -ri 'inspector' src/` returns 0 matches except in obsolete-doc-rewrite work (Phase 5). `npm run build` passes. The 5 tabs render unchanged.

---

## Phase 2 — Apply the corrected atoms to all tabs + activate the shell

**Goal:** every hand-rolled markup pattern inside sidebar tabs is replaced by a shared atom from the new `SidebarAtoms.tsx`. The cascade is visually consistent (one accent color, one keyframe button, one indent rhythm). The orphan shell files become the real layout root.

### 2.1 Theme tokens (foundation for all atoms)  ·  *suggested: Sonnet 4.6 / medium effort*

Add CSS variables to the global theme stylesheet (the file imported by `main.tsx` — verify which: likely `src/styles/globals.css` or similar) so atoms never hardcode Tailwind palette names:

```
--sidebar-accent           replaces the indigo-600 / emerald-600 / blue-500 drift; choose ONE — recommend reusing the existing shadcn `--primary` token
--sidebar-accent-soft      replaces indigo-50 / blue-50
--sidebar-keyframe-active  replaces indigo-500
--sidebar-divider          replaces zinc-300/80 / zinc-800
--sidebar-control-bg       replaces zinc-100 / zinc-800
--sidebar-info-bg          replaces zinc-50/50
```

The unified accent is the only intentional visual change in Phase 2 — call it out in the verification comparison against the locked baseline.

### 2.2 Tab refactors (one PR per tab to keep diffs reviewable)  ·  *suggested: Sonnet 4.6 / high effort for VisualTab + PhysicsTab; Opus 4.7 / high for CameraTab (custom pucks); Sonnet 4.6 / medium for the rest*

- **VisualTab** — replace `GradientColorField` (→ `SidebarColorRow`); replace the shape `<div className="flex bg-zinc-100…">` row (→ `SidebarButtonGroupRow`); replace the three ad-hoc `<Switch>` instances with `SidebarToggleRow` (no className overrides — use the `tone` variant); replace the "Fx" panel (→ `SidebarCollapsiblePanel`). The mis-used H3 on "Basis-Skalierung", "Radialer Bias", "Weight-Mapping", "Global Opacity", etc. all become `SidebarSliderRow` spans. "Form" and "Atmosphäre-Gradient" stay as `SidebarGroup` (h3) because they are real groups of multiple controls. Remove the `text-[11px]` override on the "Atmosphäre-Gradient" subgroup title.
- **PhysicsTab** — adopt `SidebarKeyframeToggle` for all 8 params (pass through the `accessory` slot of `SidebarSliderRow`). The parameter group array stays. Every parameter row collapses from h3 to label-row. The three section titles (`Kräfte`, `Dynamik`, `Ordnung`) become `SidebarSection` h2s.
- **CameraTab** — biggest delta. The orbit/pan/zoom interaction logic is kept (it's deliberate, custom UI), but the chrome wraps in `SidebarSection` + `SidebarDragPuck` + `SidebarInfoBox`. Removes ~20 hardcoded zinc/blue strings. The three labels ("Rotation (Orbit)", "Pan", "Zoom") become h2 via `SidebarSection`. Drag-active state uses `--sidebar-accent` (not blue-500 / indigo-500).
- **CanvasTab** — replace RadioGroup labels with `SidebarRadioCard`; info text uses `SidebarInfoBox`. "Seitenverhältnis" stays h2.
- **ContentTab** — wrap the Textarea+Button block in a `SidebarGroup`; the radio options use `SidebarRadioCard`. "Text" and "Parse-Modus" stay h2.

Across all five tabs the rule is: **no className override is passed into any atom**. If a tab needs a different look, it requests it via a variant prop on the atom, not by overriding from the outside.

### 2.3 Activate the shell layer (resolves the deferred shell-file question)  ·  *suggested: Opus 4.7 / max effort — riskiest single step, touches global layout*

- Refactor `src/app/App.tsx` to compose `AppShell` + `AppCanvas` + `AppSidebar` rather than inlining their logic.
- `AppSidebar` wraps the new `Sidebar` component and owns the resize handle (move the duplicated handler out of App.tsx).
- Delete the duplicate `startInspectorResize` from App.tsx; keep only the one inside `AppSidebar.tsx` (renamed to `startSidebarResize`).
- Document the new layout: `AppShell` is the absolute-positioning skeleton, `AppCanvas` is the artboard middle band, `AppSidebar` is the right docked band. The slim-composer rule from `AGENTS.md` is now true rather than aspirational.

**Acceptance:** zero hardcoded hex / Tailwind color literals inside `src/app/components/sidebar/`. Visual diff against the locked baseline (STYLE_GUIDE table lines 87–119) is identical pixel-for-pixel except where the unified accent color replaces inconsistent ones (call this out explicitly when reviewing).

**Suggested ordering inside 2.2** (commit per tab, not all at once): ContentTab → CanvasTab → PhysicsTab → VisualTab → CameraTab. Start with the simplest to validate the atom set before tackling the gnarly ones.

---

## Phase 3 — Extend the atomic cascade to every UI surface

**Goal:** TopBar, Toolbar, Timeline, Preview, and dialogs all compose from atom packs of their own. The visual contract is published once and re-used; no surface re-implements pill / button / divider / label / chip styling.

### 3.1 New atom packs  ·  *suggested: Opus 4.7 / high effort for the first pack (sets the pattern); Sonnet 4.6 / medium for subsequent packs; Opus 4.7 / high for TimelineAtoms (most complex consumer)*

| File | Atoms |
|---|---|
| `src/app/components/topbar/TopBarAtoms.tsx` | `TopBarPill` (replaces the duplicated `px-3 h-11 bg-sidebar border border-sidebar-border shadow-sm rounded-xl`), `TopBarMenuButton`, `TopBarToggleButton`, `TopBarIconButton` |
| `src/app/components/toolbar/ToolbarAtoms.tsx` | `ToolbarShell` (the `bg-zinc-50/90 backdrop-blur-md…` container), `ToolButton` (moved out of `Toolbar.tsx` inline), `ToolbarDivider` |
| `src/app/components/timeline/TimelineAtoms.tsx` | `TrackRow`, `TrackLabel`, `TrackValueChip`, `GraphEditorHeader`, `RulerTick`. The keyframe SVG icons stay where they are. |
| `src/app/components/preview/PreviewAtoms.tsx` | `Artboard` (the `rounded-[2px] border` shell), `OverlayBadge` (used by version + camera-info — currently duplicated), `LoadingOverlay` |
| `src/app/components/dialogs/DialogAtoms.tsx` | `DialogSection`, `DialogFieldRow`, `DialogFooterRow` (used by `ShortcutsDialog` and any future dialog) |

### 3.2 Shared theme primitives  ·  *suggested: Sonnet 4.6 / medium effort*

Add `src/app/theme/tokens.ts` exporting:
- A typed list of every CSS-variable token the app uses (`--sidebar-accent`, `--topbar-pill-bg`, etc.).
- Spacing scale aliases (`pad.section = 'px-5 py-5'`, `pad.subgroup = 'space-y-3'`) — pure string constants, no runtime cost.
- The four gradient presets (currently hardcoded at `Sidebar.tsx` line 49–54) move here as a typed array so the i18n step can localize the names independently of the hex values.

Update `STYLE_GUIDE.md` "Locked Visual Baseline" table to reference token names instead of literal hex values.

### 3.3 Hardcoded-color sweep  ·  *suggested: Sonnet 4.6 / high effort — one mistake cascades*

Replace every remaining literal:
- `TopBar.tsx` `NetworkLogo` SVG `#3b9eff` → CSS var `--brand-network-blue` (defined in tokens.ts).
- `TopBar.tsx` line 163 `bg-blue-500/10` → `var(--topbar-toggle-active)`.
- `Sidebar.tsx` gradient preset hex values → keep hex (they ARE the data) but move to tokens.ts.
- `Network3D.tsx` edit-mode / select / hover colors → already partially in `networkTheme.ts`; finish the migration.
- `GraphEditor.tsx` selected-keyframe `#3b82f6` → `var(--timeline-keyframe-selected)`.

### 3.4 shadcn pruning (defer the actual delete to Phase 5)  ·  *suggested: Haiku 4.5 / minimal effort — pure grep audit*

Compile a verified list of unused shadcn files (Explore agent identified ~15 candidates — `alert-dialog`, `alert`, `avatar`, `breadcrumb`, `calendar`, `carousel`, `chart`, `form`, `hover-card`, `navigation-menu`, `pagination`, `scroll-area`, `sheet`, `table`, `tabs`). Run `grep -r "from '@/.../ui/<file>'"` for each before deleting in Phase 5.

**Acceptance:** `grep -E "#[0-9a-fA-F]{6}" src/app/components/ --include="*.tsx"` returns 0 matches outside the gradient presets and the locked node-color gradient in `networkTheme.ts`. All TopBar / Toolbar / Timeline visual surfaces compose from their atom packs.

**Suggested ordering inside 3.1** (one pack + its consumer at a time, commit at each): TopBar → Toolbar → Preview → Dialogs → Timeline. Timeline last because it's the most internally complex.

---

## Phase 4 — Internationalization (EN code, DE default UI)

**Goal:** every user-visible string flows through `t('key')`. The displayed default stays German. A menu-bar switch toggles between EN and DE; the choice persists across reloads. Browser-language detection added behind a feature flag for later activation.

### 4.1 Install + wire  ·  *suggested: Opus 4.7 / high effort for the i18n config design (sets a long-term pattern); Sonnet 4.6 / minimal for the actual install command*

```
npm install i18next react-i18next i18next-browser-languagedetector
```

New files:
- `src/app/i18n/index.ts` — initializes i18next with `lng: 'de'`, `fallbackLng: 'en'`, namespaces by surface (`sidebar`, `topbar`, `toolbar`, `timeline`, `dialogs`, `common`).
- `src/app/i18n/locales/en.json` — English strings, source of truth.
- `src/app/i18n/locales/de.json` — German strings, mirrors the EN key tree.
- `main.tsx` imports `./app/i18n` before `<App>`.

Namespace example (`sidebar.tab.visual.section.knoten.title`):
```json
{
  "tab": {
    "visual": { "title": "Visualisierung",
      "section": {
        "knoten":       { "title": "Knoten" },
        "beschriftung": { "title": "Beschriftung" },
        "verbindungen": { "title": "Verbindungen" },
        "umgebung":     { "title": "Umgebung" }
      }
    }
  }
}
```

### 4.2 String extraction  ·  *suggested: Sonnet 4.6 / medium effort per file. Commit per file, not in batch — that way a missed string in one file doesn't entangle with the next.*

Work through 11 files (counts from the Explore audit):
- `TopBar.tsx` (~15 strings)
- `Toolbar.tsx` (~7 tool tooltips)
- `Sidebar.tsx` (~12 strings, mostly tab metadata — replaced by `sidebarConfig.ts`)
- `sidebar/tabs/ContentTab.tsx` (~10)
- `sidebar/tabs/PhysicsTab.tsx` (~30 — biggest)
- `sidebar/tabs/CameraTab.tsx` (~15)
- `sidebar/tabs/VisualTab.tsx` (~25)
- `sidebar/tabs/CanvasTab.tsx` (~7)
- `ShortcutsDialog.tsx` (~8)
- `Timeline.tsx` + `TimelineTracks.tsx` (~5 + the physics track names in `WortnetzContextConstants.ts`)
- Toast / Sonner messages (audit during this phase)

For each: replace literal → `t('namespace.key')`. Decisions for tricky cases:
- **Parameter labels with parenthetical hint** ("Streuung (Abstoßung)") — split into two keys: `name` + `hint`, then render `{name} ({hint})` so each language flows naturally.
- **Gradient preset names** ("Indigo → Violett") — translate the human name only; the hex pair stays in `tokens.ts`.
- **Toolbar tooltips with shortcut** ("Hand (H)") — separate `name` and reuse a shared `shortcut.<key>` value so the parenthesis pattern is consistent.

### 4.3 Language switch UI  ·  *suggested: Opus 4.7 / high effort — UI design + persistence behavior together*

- Add to `TopBar.tsx` "Ansicht" menu (or a new "Sprache" / "Language" submenu) — a `MenubarRadioGroup` with `Deutsch` / `English`.
- Persist selection via `localStorage` key `wortnetze.language`.
- Initial load reads `localStorage` → falls back to `'de'`.
- Add an "Auto-detect" option in the same menu, off by default. When enabled, `i18next-browser-languagedetector` reads `navigator.language` and matches `de-*` / `en-*`. This is the "later" browser-language hook the user asked for, placed behind an opt-in toggle so the German default is never auto-changed without consent.

### 4.4 Reverse the doc constraints  ·  *suggested: Sonnet 4.6 / medium effort — short prose edits*

- `STYLE_GUIDE.md` "UI Language" section — rewrite: *"English is the source of truth in code (variable names, JSON keys, comments). German is the displayed default. UI text MUST be loaded through `useTranslation()` — never hardcoded literals."*
- `AGENTS.md` constraint #3 — same inversion.

**Acceptance:** `grep -E '"[A-ZÄÖÜ][a-zäöüß ]{2,}"' src/app/components/ --include="*.tsx"` (rough heuristic for German literal sentences) returns only legitimate code (class names, IDs) — no UI text. Switching DE↔EN in the menu re-renders all surfaces. Reload preserves the choice.

**Suggested ordering inside 4.2** (commit per file): TopBar → Toolbar → ShortcutsDialog → CanvasTab → ContentTab → CameraTab → VisualTab → PhysicsTab → Timeline → Sonner toast audit. Smallest files first to validate the key-naming convention before tackling PhysicsTab's 30 strings.

---

## Phase 5 — Documentation overhaul & cleanup

**Goal:** the documentation set actually describes the codebase, has clear ownership boundaries, fits AI agents, and contains no zombie files. The audit revealed problems deeper than "rename Inspector → Sidebar"; this phase addresses them.

### 5.1 Doc rewrites (substantive, not cosmetic)  ·  *suggested: Opus 4.7 / high effort for AGENTS, PROJECT, STYLE_GUIDE, ROADMAP, ONBOARDING. Opus 4.7 / max for ARCHITECTURE Section 2 (the truncated one — biggest doc rewrite). Sonnet 4.6 / medium for ATTRIBUTIONS and VOCABULARY (mechanical). Haiku 4.5 / minimal for the README pointer block. Sonnet 4.6 / high for the .github/agents/ rename + softening.*

| File | Action — what to fix beyond the rename |
|---|---|
| `AGENTS.md` | **(a)** Constraint #3 ("Always maintain German default") → rewrite as: *"User-facing text is loaded via `useTranslation()`. The displayed default is German; English is the source-of-truth in code (identifiers, JSON keys, comments)."* **(b)** Constraint #2 ("App.tsx must remain a slim layout composer") — currently *contradicted* by 380-line App.tsx. After Phase 2's shell activation this becomes true. Add a verification line: *"`wc -l src/app/App.tsx` < 100."* **(c)** Routing list adds the new docs (`VOCABULARY.md`, `ONBOARDING.md`). **(d)** State explicitly that `CLAUDE.md` and `GEMINI.md` are harness-required redirect files (NOT independent guidance) — AGENTS.md is the only standing-orders doc. |
| `PROJECT.md` | **(a)** Remove the circular "do not look for standing orders here" wording — replace with crisp ownership: *"PROJECT.md = file map and reverse index. AGENTS.md = standing constraints. ARCHITECTURE.md = system design. STYLE_GUIDE.md = visual rules. VOCABULARY.md = string ↔ code mapping."* **(b)** Update file map: `Inspector.tsx` → `Sidebar.tsx`; add `sidebar/tabs/`, `sidebar/SidebarAtoms.tsx`, `topbar/TopBarAtoms.tsx`, `toolbar/ToolbarAtoms.tsx`, `timeline/TimelineAtoms.tsx`, `preview/PreviewAtoms.tsx`, `dialogs/DialogAtoms.tsx`, `theme/tokens.ts`, `i18n/`. **(c)** Add a "Reverse index" section: concept → file (e.g. "Where does undo live?" → `hooks/useTimelineHistory.ts`). |
| `ARCHITECTURE.md` | **(a)** **CRITICAL: complete the truncated Section 2.** Currently ends mid-sentence at line 56. Rewrite it with subsections 2.1 State (WortnetzContext slices), 2.2 Undo/Redo (`useTimelineHistory`), 2.3 Save/Load (`useWorkspaceIO`), 2.4 Keyframe interpolation (Hermite splines — why, not just what), 2.5 Camera system internal state. **(b)** Add a new Section 3 "UI composition cascade": `AppShell → AppCanvas / AppSidebar → Sidebar → SidebarSection (h2) → SidebarGroup (h3, only for real groups) → SidebarRow → atomic control`. **(c)** Cross-reference STYLE_GUIDE for visual constraints; do not duplicate them. |
| `STYLE_GUIDE.md` | **(a)** Rewrite "UI Language" section per the i18n inversion. **(b)** Move detailed atom rhythm/typography rules out of the doc and into the JSDoc of `SidebarAtoms.tsx` — reference back from STYLE_GUIDE. The doc currently duplicates code comments (DRY violation). **(c)** "Locked Visual Baseline" table: add a column for the CSS variable name next to each hex, mark "drift-prone — re-verify quarterly." **(d)** Fix the misleading "Subset of the 49 available" wording (line 124) — just list the components actually used. **(e)** Rename all "Inspector" references. **(f)** Add the "Atom-first rule" at the top: *"Every UI surface composes from its own `*Atoms.tsx` pack. Hand-rolled className stacks or hex values in `.tsx` files are violations. CSS variables are the only color source."* |
| `ROADMAP.md` | **CRITICAL: the file is a literal placeholder** (`*(... keep the rest of your ROADMAP.md exactly as it is...)*` at line 14). Write a real one with four sections: *Active*, *Planned*, *Known gaps*, *Completed*. Seed it from this plan's phases. If the project will track work in GitHub Projects instead, delete `ROADMAP.md` and put a 1-line pointer in `PROJECT.md`. |
| `ATTRIBUTIONS.md` | **CRITICAL: licensing gap.** Currently credits only shadcn/ui and Unsplash. Add Three.js (MIT), Radix UI (MIT), Tailwind CSS (MIT), TypeScript (Apache 2.0), React (MIT), Vite (MIT), Space Grotesk (OFL), i18next (MIT), and any other runtime dep. Generate from `package.json` `dependencies` to ensure completeness. |
| `README.md` | Add a "For contributors" pointer line: *"Start at [AGENTS.md](./AGENTS.md). Architecture in [ARCHITECTURE.md](./ARCHITECTURE.md). Visual rules in [STYLE_GUIDE.md](./STYLE_GUIDE.md)."* Otherwise leave intact. |
| `.github/agents/inspector-atom-maintenance.agent.md` | Rename to `sidebar-atom-maintenance.agent.md`. Update file paths and atom names. **Soften the acceptance checklist** from strict PASS/FAIL to allow PARTIAL — e.g. "8 of 10 sliders are click-to-edit buttons" is information the current binary format cannot express. Replace the broken `/memories/repo/...` reference (session-local, breaks across sessions). |
| `.github/prompts/inspector-violations-review.prompt.md` | Rename to `sidebar-violations-review.prompt.md`. Same softening. |
| `.github/skills/inspector-patch-summary/SKILL.md` | Rename folder to `sidebar-patch-summary/`. Add an explicit "no diff detected → exit cleanly" branch. |
| `CLAUDE.md` | **KEEP as a thin redirect** — the Claude Code harness *automatically loads* this file as project context. Deleting it breaks that pickup. The current 3-line content (redirect to AGENTS.md) is correct; leave it untouched. |
| `GEMINI.md` | **KEEP as a thin redirect** for the same reason — Gemini CLI conventions auto-load this file. Verify the content is still a clean one-line redirect to AGENTS.md (audit found it is); leave it. |
| `guidelines/Guidelines.md` | **DELETE.** Verbatim overlap with AGENTS.md routing — see audit. |
| `VOCABULARY.md` (new) | Code identifier ↔ UI display string mapping (EN + DE). Single source for translation key naming. Used by the i18n workflow in Phase 4. |
| `ONBOARDING.md` (new) | A 1-page "start here" doc. Sections: *What this project is*, *Where the code lives*, *How to run it*, *The atomic-component contract*, *Where to ask*. For a new human or AI contributor. |

### 5.2 Orphan file deletion (verify each before removing)  ·  *suggested: Sonnet 4.6 / medium effort — verify-then-delete needs a careful pass*

- `bulkAppPatch.cjs`, `fixRedo.cjs`, `patch.diff` — one-time refactor artifacts.
- `default_shadcn_theme.css` — verify not imported by `main.tsx` / `index.html` / any CSS; delete if confirmed unused.
- `snapshots/` — stale CI artifact; delete or `.gitignore`.
- `pnpm-lock.yaml` OR `package-lock.json` — keep one. `package.json` does not currently set `packageManager`. **Recommendation: standardize on `npm`** (since `package-lock.json` is what hooks/CI typically expect, and you've been running npm commands). Add `"packageManager": "npm@10.x"` to `package.json` and delete `pnpm-lock.yaml`.
- Unused shadcn components — delete the verified list from Phase 3.4.
- `InspectorTabGroup` atom — already removed in Phase 1.

### 5.3 Final sweep  ·  *suggested: Haiku 4.5 / minimal effort — grep + small edits*
- Resolve the two `// TODO` / `// legacy` markers in `timeline/types.ts` and `GraphEditor.tsx` (delete or clarify with a one-line comment explaining the constraint).
- Verify `WortnetzContext` state slice names are consistent (the `inspector*` → `sidebar*` rename, no other drift).

**Suggested ordering inside 5.1** (commit per doc): ATTRIBUTIONS (mechanical, easiest first) → README pointer → AGENTS → PROJECT → STYLE_GUIDE → ARCHITECTURE Section 2 (the heaviest) → ROADMAP → VOCABULARY (generated from JSON) → ONBOARDING → `.github/agents/` rename. Lockfile resolution and orphan-file deletion in 5.2 happen last because they're irreversible.

---

## Critical files reference

**Already exist, will be modified:**
- `src/app/App.tsx` — Phase 2 shell composition rewrite.
- `src/app/context/WortnetzContext.tsx`, `WortnetzContextTypes.ts`, `WortnetzContextConstants.ts` — `inspector*` → `sidebar*` (Phase 1).
- `src/app/constants.ts` — `DEFAULT_INSPECTOR_WIDTH` → `DEFAULT_SIDEBAR_WIDTH`.
- `src/app/components/Inspector.tsx` → renamed `Sidebar.tsx` (Phase 1), then atomized further (Phase 2).
- `src/app/components/inspector/*.tsx` → moved to `src/app/components/sidebar/tabs/*.tsx` (Phase 1), atomized (Phase 2), i18n-wrapped (Phase 4).
- `src/app/components/shell/AppShell.tsx`, `AppCanvas.tsx`, `AppSidebar.tsx` — activated in Phase 2.
- `src/app/components/TopBar.tsx`, `Toolbar.tsx`, `Preview.tsx`, `ShortcutsDialog.tsx` — atomized in Phase 3, i18n in Phase 4.
- `src/app/components/timeline/*.tsx` — atomized in Phase 3, i18n in Phase 4.
- `src/main.tsx` — i18n init import (Phase 4).

**New files to create:**
- `src/app/components/sidebar/SidebarAtoms.tsx` — rewritten from old `InspectorAtoms` with corrected hierarchy.
- `src/app/components/sidebar/sidebarConfig.ts` — tab metadata (id, icon, title key, i18n namespace).
- `src/app/components/topbar/TopBarAtoms.tsx`.
- `src/app/components/toolbar/ToolbarAtoms.tsx`.
- `src/app/components/timeline/TimelineAtoms.tsx`.
- `src/app/components/preview/PreviewAtoms.tsx`.
- `src/app/components/dialogs/DialogAtoms.tsx`.
- `src/app/theme/tokens.ts` — typed exports of CSS variable names and spacing scale aliases.
- `src/app/i18n/index.ts`, `src/app/i18n/locales/en.json`, `src/app/i18n/locales/de.json`.
- `VOCABULARY.md` (root) — string ↔ code mapping.
- `ONBOARDING.md` (root) — contributor start-here.

**Reused without modification (functions/utilities found that should NOT be rewritten):**
- `useTimelineHistory.ts`, `useWorkspaceIO.ts`, `useShortcuts.ts`, `useProject.ts` — solid hooks, unaffected.
- `graph/parsing.ts`, `graph/physics.worker.ts` — engine code, untouched.
- `networkTheme.ts` — already the right pattern for 3D scene colors; only finish the migration started here.
- shadcn primitives in `components/ui/` — keep using them via aliases / composition.
- `easing.ts` — math, untouched.

---

## Verification

Run after each phase, gate on green before moving to the next:

1. **Build** — `npm run build` exits 0.
2. **TypeScript strict** — `npx tsc --noEmit` exits 0.
3. **Dev server smoke test** — `npm run dev`, open in browser:
   - All 5 sidebar tabs render. Tab switching works.
   - Each tab's sliders are editable by click-to-type (per STYLE_GUIDE SliderParam rule).
   - Keyframe toggles on PhysicsTab activate/deactivate visually.
   - CameraTab orbit/pan/zoom widgets respond to drag.
   - TopBar menus open. Toolbar tools select. Timeline plays. Preview renders the graph.
   - Resize the sidebar handle — `sidebarWidth` persists via context.
4. **Visual baseline parity** — compare against `STYLE_GUIDE.md` "Locked Visual Baseline" table; the only intentional change is the unified accent color in Phase 2.
5. **i18n verification** (Phase 4 only):
   - Set localStorage `wortnetze.language` to `en` → reload → entire UI is English.
   - Set to `de` → reload → entire UI is German.
   - Switch via the new menu → re-renders without reload.
   - `grep -nE '">[A-ZÄÖÜ][a-zäöüß ]{3,}<"' src/app/components/` returns no matches (no German text leaked outside `t()`).
6. **Doc consistency** —
   - `grep -ri 'inspector' .` returns zero matches in `.md` files (Phase 5).
   - `ARCHITECTURE.md` Section 2 is no longer truncated; subsections 2.1–2.5 present.
   - `ROADMAP.md` contains no placeholder strings ("keep the rest of your ROADMAP as it is").
   - `ATTRIBUTIONS.md` lists every runtime dep in `package.json`'s `dependencies` (cross-check).
   - `wc -l src/app/App.tsx` ≤ 100 (slim composer constraint now true).
   - `AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `STYLE_GUIDE.md`, `VOCABULARY.md`, `ONBOARDING.md` each have clear, non-overlapping ownership statements in their headers.
7. **Orphan removal** — `ls bulkAppPatch.cjs fixRedo.cjs patch.diff default_shadcn_theme.css guidelines/` returns "no such file" for each. (`CLAUDE.md` and `GEMINI.md` stay — they are harness-auto-loaded redirect files.)

Each phase ends with a commit (or branch) so any phase can be rolled back independently. The phase order is the dependency order — Phase 2 requires Phase 1's names, Phase 4 requires Phase 3's atomization to know which strings are user-facing, Phase 5 requires Phases 1–4 to know what to document.
