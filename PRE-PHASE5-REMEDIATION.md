# Pre–Phase 5 remediation plan

**Goal:** Close all debt from Phases **1–4** so Phase 5 is only documentation, orphan deletion, and shadcn pruning.

**Out of scope (Phase 5):** delete `bulkAppPatch.cjs`, `guidelines/`, lockfile choice; full `ARCHITECTURE.md` / `ROADMAP.md` / `PROJECT.md` rewrites; `VOCABULARY.md` / `ONBOARDING.md`; `.github` agent renames; shadcn file deletion; `ATTRIBUTIONS.md` expansion; STYLE_GUIDE baseline table rewrite.

**Execution gates (per-step, categorized — see §0 for decisions):**

```
COLOR / TOKEN steps (06, 07, 22, 23):
  + grep -E '#[0-9a-fA-F]{6}' on touched files = 0 expected hits
  + DevTools computed-styles: every `var(--wn-*)` resolves to a real color
  + visual diff vs STYLE_GUIDE locked baseline
I18N steps (10–18):
  + de.json ↔ en.json deep-key parity diff = 0
  + manually walk every affected surface in BOTH languages (~3 min, not 30s)
  + grep JSON for values equal to their key path (stale-key check)
SHORTCUT step (13):
  + press every shortcut in browser; verify each behavior actually runs
APP.TSX step (26):
  + interaction smoke: keyframe → play → scrub → undo → redo → save → reload → load → sidebar resize persists → all 5 tabs render
ALL steps (baseline):
  + npm run build → npx tsc --noEmit → commit `pre-phase5.<nn>: <summary>`
```

---

## §0 — Decisions & deltas from `plan.md`

Locked-in decisions made during the pre-execution audit. These are explicit deltas from the original `plan.md`:

- **Step 02 phys-min → DELETE.** Promote path rejected — a non-coder cannot make the required UX decisions (slider range, label copy in two languages, tab layout impact). `minSpeed` stays as a static physics value (default 0.5).
- **Step 13 shortcuts → translate display labels only.** No `commandId` enum refactor (scope creep). Confirm `'Sidebar umschalten'` at `useShortcuts.ts:48` IS wired (`App.tsx:169` passes `onToggleSidebar`) — DO NOT delete it.
- **Step 17 PathAnimator → i18n + token swap only.** No `PathAnimatorAtoms.tsx` — single-consumer atom pack rejected as the anti-pattern Phase 3 implicitly warned against.
- **Step 26 App.tsx → target ≤150 lines.** Original `plan.md` acceptance criterion `wc -l App.tsx ≤ 100` deferred to post–Phase 5. No required `AppWorkspace.tsx` extraction.

---

## Why the old "Track I" numbering?

An earlier draft used **Track A–H** for repo hygiene and shell work. Later audits were appended as **Track I** (Phase 4), **J** (3), **K** (1), **L** (2) instead of renumbering A–H. That made the doc read as if work started at letter I.

**This revision uses a single ordered list: Step 01, Step 02, …** Audit summaries by phase are below; **do the steps in §Remediation steps in order** (dependencies are baked in).

---

## Audit snapshot (what Phases 1–4 actually delivered)

### Phase 1 — Rename + atom hierarchy · **~90%**


| Plan step                                                           | Status                               |
| ------------------------------------------------------------------- | ------------------------------------ |
| 1.1 `SidebarAtoms` rewrite, delete `InspectorTabGroup`              | Done                                 |
| 1.2 `Inspector` → `Sidebar`, `sidebar/tabs/`                        | Done                                 |
| 1.3 `sidebarWidth`, `DEFAULT_SIDEBAR_WIDTH`, etc.                   | Done · `grep -ri inspector src/` → 0 |
| 1.4 `ShadSidebar*` aliases                                          | Done                                 |
| 1.5 `SidebarTabHeader`, `SidebarActivityButton`, `sidebarConfig.ts` | Done                                 |


**Gaps:** `SidebarEditableNumber` exists but is **never used**; `SidebarDivider` **missing**; public `SidebarRow` not exported (optional); dead `width` prop on `Sidebar`.

---

### Phase 2 — Tabs on atoms + shell + tokens · **~75%**


| Plan step                                      | Status                                                         |
| ---------------------------------------------- | -------------------------------------------------------------- |
| 2.1 `--wn-*` tokens in `theme.css`             | Done (plan said `--sidebar-*`; same intent)                    |
| 2.2 All five tabs on sidebar atoms             | Mostly done                                                    |
| 2.2 VisualTab toggles                          | Done · `tone` + `wn-accent`, no indigo/emerald                 |
| 2.2 CameraTab                                  | Partial · zoom hand-rolled; many `zinc-*`; no `SidebarInfoBox` |
| 2.2f Legacy `InspectorAtoms` deleted           | Done                                                           |
| 2.3 `AppCanvas` + `AppSidebar`, resize deduped | Done                                                           |
| 2.3 `AppShell` in `App.tsx`                    | `**AppShell` lives in `main.tsx`** (OK)                        |
| 2.3 Slim `App.tsx` (<100 lines)                | **Fail · 357 lines**                                           |


**Gaps:** ~134 `zinc-*` under `sidebar/`; sliders use static value chips not click-to-edit; VisualTab shuffle/visibility hand-rolled; `phase2.2f` "closed" message overstated.

---

### Phase 3 — Atom packs on other surfaces · **~70%**


| Surface          | Status                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| TopBar           | `TopBarPill`, `TopBarMenuTrigger`, `TopBarActionButton` · 2D/3D toggle still hand-rolled |
| Toolbar          | Shell + `ToolButton` + divider · still `zinc-*`                                          |
| Preview          | `Artboard`, `OverlayBadge`, `LoadingOverlay` · loading label hardcoded German            |
| Dialogs          | `DialogFieldRow` only (defer Section/Footer until 2nd dialog)                            |
| Timeline         | `**TrackLabel` only** · `TBtn` inline; `types.ts` still has `#hex`                       |
| 3.4 shadcn audit | `UNUSED_COMPONENTS.md` done · **wrongly lists `textarea.tsx` as unused**                 |
| 3.5 verification | **Hollow** (version bump only)                                                           |


**Gaps:** Timeline/Toolbar/Preview/Network3D color sweep incomplete; `PathAnimatorUI` not atomized, still `indigo-*`.

---

### Phase 4 — i18n · **~85%**


| Plan step                                      | Status                                                     |
| ---------------------------------------------- | ---------------------------------------------------------- |
| 4.1 i18next + `useT` + `main.tsx` import       | Done (after 4.x-audit namespace flatten)                   |
| 4.2 Eleven planned files                       | Mostly done                                                |
| 4.3 Language menu + localStorage + auto-detect | Partial · auto needs **reload**; `de-DE` vs `de` radio bug |
| 4.4 `AGENTS.md` / `STYLE_GUIDE.md` UI language | **Not started**                                            |


**Missed surfaces:** `ErrorBoundary`, `timeline/ContextMenu`, `PathAnimatorUI`, `useShortcuts` (German IDs), `CameraTab` view `title`s; DE locale English leaks; `phys-min` orphan.

---

## Remediation steps (do in order)

### Block A — Hygiene & cross-phase fixes

**Step 01 — Untrack accidental repo artifacts**  

- `git rm --cached plan.md` (repo root), all `.DS_Store`; confirm `.gitignore`.  
- Do **not** delete `bulkAppPatch.cjs`, `guidelines/`, etc. (Phase 5).

**Step 02 — DELETE `phys-min` orphan** (decision locked, §0)

`phys-min` has no UI (not in `TRACK_GROUPS`, not in `PhysicsTab`). `minSpeed` itself remains live in `graph/physics.ts:237` and falls back to `DEFAULT_PHYSICS.minSpeed = 0.5`. Delete the orphan keyframe scaffolding only.

Targets:
- `src/app/components/Sidebar.tsx:131` — remove `'phys-min'` from the hardcoded `tracks` array.
- `src/app/context/WortnetzContextConstants.ts:7` — remove `'phys-min': []` from `EMPTY_PHYSICS_KFS`.
- `src/app/context/WortnetzContextConstants.ts:19` — remove `'phys-min': 'minSpeed'` from `PHYS_TRACK_PARAM`.
- `src/app/components/Network3D.tsx:162-172` — `PHYS_TRACK_PARAM` is **duplicated here**. Either remove `'phys-min'` entry too, OR (preferred) import the constant from `WortnetzContextConstants.ts` and delete the duplicate.

Pre-flight: `grep -r '"phys-min"' .` in any saved-project directory — expect zero hits.

Verification: app loads, no console errors, physics simulation runs (minSpeed default 0.5 still applies).

**Step 03 — Remove dead `Sidebar` `width` prop**  

- Drop from `SidebarProps`, `App.tsx` pass-through; width stays on `AppSidebar` only.

---

### Block B — Phase 1 + 2 sidebar (atoms, STYLE_GUIDE, tokens)

**Step 04 — Wire `SidebarEditableNumber` on all slider rows (P0)**

Phase 1.1 moved `SliderValue` → `SidebarEditableNumber` (`SidebarAtoms.tsx:227-296`) but Phase 2 never connected it. Today `SidebarSliderRow` renders the value via static `SidebarValueChip` (`SidebarAtoms.tsx:358`).

**Sub-ordering (each is its own commit; each must build green):**
1. Update `SidebarSliderRow` API in `SidebarAtoms.tsx` to accept editable numeric props (`value`, `min`, `max`, `step`, `onCommit`, optional `format`/`parseInput`). Internally wrap with `SidebarEditableNumber` instead of `SidebarValueChip`. Commit `pre-phase5.04a`.
2. Migrate **PhysicsTab** call sites. Commit `pre-phase5.04b`.
3. Migrate **VisualTab** call sites. Commit `pre-phase5.04c`.

Satisfies STYLE_GUIDE SliderParam rule (click-to-type, not static `<span>` chip).

Verification: in browser, click every slider value in PhysicsTab and VisualTab — must enter edit mode; typed values must clamp to min/max; Esc cancels; Enter/Tab/blur commits.

**Step 05 — Add `SidebarDivider`; fix tab content divides**  

- New atom using `--wn-divider` / `border-wn-divider`.  
- Replace `SidebarTabContent` `divide-zinc-*`.

**Step 06 — `CameraTab`: zoom → `SidebarSliderRow` (P1)** (swapped with old Step 07 — see audit)

Rewrite the hand-rolled CameraTab markup first, then sweep colors in Step 07. This avoids cleaning up zinc-* on code that gets deleted immediately afterwards.

- Replace hand-rolled zoom band with `SidebarSliderRow` + `SidebarSliderTrack`.
- Extract view-preset puck buttons → `SidebarViewPresetButton` (or puck slot helper) — pairs with Step 16 i18n on `title=`.

**Step 07 — Migrate sidebar `zinc-*` → `--wn-*` / semantic tokens (P1)** (swapped with old Step 06)

Order: `SidebarAtoms.tsx` → `VisualTab.tsx` → `ContentTab.tsx` → `CameraTab.tsx`.
`CameraTab` is now last so the residual classes after Step 06's atom extraction inherit the new tokens in one pass.
Use `--wn-divider`, `--wn-control-bg`, `--wn-info-bg`, `border-border`, `text-muted-foreground`, etc.
Update stale JSDoc in `SidebarAtoms.tsx` ("Phase 2.A swaps zinc…").

Note: actual `zinc-*` count under `src/app/components/sidebar/` is **64**, not ~134 (audit corrected). Per-file: SidebarAtoms 31 / CameraTab 28 / ContentTab 2 / VisualTab 3.

**Step 08 — `VisualTab`: section action atoms (P2)**  

- `SidebarVisibilityToggle` (eye on/off).  
- `SidebarSectionActionButton` (shuffle dice).  
- Removes hand-rolled zinc buttons in section `actions`.

**Step 09 — *(Optional)* Export public `SidebarRow`**  

- Thin wrapper over private `RowHeader` if you want plan API parity; skip if not needed.

---

### Block C — Phase 4 i18n infrastructure (P0)

**Step 10 — Normalize language codes**  

- `normalizeLanguage(lng): 'de' | 'en'` in `src/app/i18n/index.ts`.  
- Export `LANGUAGE_STORAGE_KEY`, `LANGUAGE_AUTO_KEY`.  
- `useT.ts`: `language` from `normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)`; remove unsafe cast.

**Step 11 — Auto-detect without full page reload**  

- `TopBar.tsx:58`: on `auto`, set flags + call `changeLanguage` from `navigator` (or re-init detector); **no** `window.location.reload()`.  
- Type the i18next `InitOptions` properly (currently relies on inference).  
- Note: the i18n namespace structure is already single `translation` (commit `069b6ccc`). The six top-level keys in `de.json`/`en.json` (`common`, `dialogs`, `sidebar`, `timeline`, `toolbar`, `topbar`) are **normal nested groups**, not a namespace problem. Do NOT reorganize the JSON.

**Step 12 — Language menu radio sync**  

- `currentLanguageValue = auto ? 'auto' : normalizeLanguage(language)`.  
- Remove `setLanguage(v as any)`.

---

### Block D — Phase 4 shortcuts & missed surfaces (P0–P1)

**Step 13 — Translate shortcut display labels (P0)** (decision locked, §0 — translate only, no commandId refactor)

- Add `shortcuts.command.save` / `.load` / `.undo` / `.redo` / `.playPause` / `.record` / `.toggleSidebar` keys to BOTH `de.json` AND `en.json`.
- `ShortcutsDialog.tsx`: read command label via `t()` instead of the hardcoded German `s.command` string.
- `useShortcuts.ts`: keep the existing switch keyed on German display strings as-is. Do NOT introduce a commandId enum in this pass (deferred).
- **DO NOT delete `case 'Sidebar umschalten'` at `useShortcuts.ts:48`.** It is wired — `App.tsx:169` passes `onToggleSidebar`. The remediation plan's original "remove dead case" wording was based on a factual error.

Verification gate: press S, O, Z, Shift+Z, Space, R in the browser and verify each action runs. Confirm dialog labels match selected language.

**Step 14 — i18n: `ErrorBoundary.tsx` (P1)**

- **Keep as a class component.** `componentDidCatch` requires class-based components; the `useTranslation` hook is unavailable inside classes.
- Import the i18n singleton: `import i18n from '@/app/i18n'`.
- Call `i18n.t('common.error.title')`, `.body`, `.webglTip`, `.reload` directly inside `render()`.
- Add the four keys (title / body / webglTip / reload) to BOTH `de.json` AND `en.json` (`common.error.*`). The German strings currently inline at `ErrorBoundary.tsx:45,47,50,53,69` are the seed for `de.json`; write fresh English for `en.json`.
- Do NOT convert to a functional component.

**Step 15 — i18n: `timeline/ContextMenu.tsx` (P1)**

- Current strings are **English literals**, not German (audit corrected the plan's "DE leaks" framing). Affected lines: `ContextMenu.tsx:39-46` (easing labels) and `:52-104` (menu items: "Add Scene Marker", "Copy", "Cut", "Paste at Playhead", "Delete", "Keyframe Easing").
- Add `timeline.contextMenu.*` keys to BOTH `en.json` AND `de.json`. The English values are moved from inline code to `en.json` for the first time; new German translations must be authored for `de.json`.

**Step 16 — i18n: `CameraTab` view preset tooltips (P1)**  

- Eight `title=` attributes → `sidebar.tab.camera.view.*` (done with Step 06 atom work if combined).

**Step 17 — `PathAnimatorUI`: i18n + accent (P1)** (decision locked, §0 — no atom pack)

- (a) Add `pathAnimator.*` keys to `de.json`/`en.json`; replace literal strings in `PathAnimatorUI.tsx` with `t()` calls.
- (b) Replace `indigo-*` classes at `PathAnimatorUI.tsx:25, 42, 47, 63` (four distinct shades: indigo-50, 100, 200, 300, 600, 700) with `wn-accent` token equivalents.
- **Do NOT create `PathAnimatorAtoms.tsx`.** Single-consumer atom packs were rejected as the anti-pattern Phase 3 implicitly warned against.

**Step 18 — Locale copy quality (P2)**  

- `de.json`: `topbar.item.preview` → `Vorschau`; `topbar.language.auto` → `Automatisch`; translate English leaks in `sidebar.tab.visual.*` where product wants German.  
- `en.json`: language menu labels `German` / `English` when UI is EN.  
- Dedupe `topbar.item.preview` vs `topbar.action.preview`.

**Step 19 — `GRADIENT_PRESETS` comment (P2)**  

- `tokens.ts`: note names move to i18n when UI consumes presets; live gradients still `networkTheme.defaultGradientSettings`.

---

### Block E — Phase 4.4 minimal docs (not full Phase 5)

**Step 20 — `AGENTS.md` §3 + `STYLE_GUIDE.md` "UI Language" only**  

- User-facing text via `useTranslation()`; DE default display; EN in JSON.  
- One-line golden ref: `Inspector.tsx` → `Sidebar.tsx`.  
- Do **not** rewrite baseline table or atom rules (Phase 5).

---

### Block F — Phase 3 atom packs & color sweep

**Step 21 — `TopBarViewToggle` atom**  

- Extract 2D/3D `ToggleGroup` from `TopBar.tsx` into `TopBarAtoms.tsx`.

**Step 22 — Timeline transport atom + timeline colors**

**22.a — Define new tokens FIRST** (must be its own commit, before any color usage):

Add to `theme.css` (or wherever existing `--wn-*` tokens live):
- `--wn-timeline-transport-active` — replaces `text-blue-400` on active transport buttons
- `--wn-timeline-drag-select` — replaces `blue-500/10` on drag-select overlay
- `--wn-timeline-keyframe-fill` — replaces inline diamond fill hex (today in `timeline/types.ts` `COLOR.kfFill`)
- `--wn-timeline-graph-stroke` — replaces inline graph stroke hex (today in `timeline/types.ts` `COLOR.graphStroke`)
- `--wn-timeline-bg` — replaces `GraphEditor.tsx` `stroke='#fff'`

Each token must have an explicit color value in `theme.css`; do not reference an undefined `var(--wn-*)` from a consumer.

**22.b — Replace consumers** (separate commits):
- `TimelineTransportButton` atom replaces inline `TBtn` in `Timeline.tsx`.
- `timeline/types.ts` `COLOR`: map `kfFill` / `graphStroke` to the new CSS vars.
- `GraphEditor.tsx`: `stroke='#fff'` → `var(--wn-timeline-bg)`.

Verification: DevTools computed-styles confirms each `var(--wn-timeline-*)` resolves to a real color; `grep -E '#[0-9a-fA-F]{6}' src/app/components/timeline/` returns 0 hits.

**Step 23 — Toolbar + Preview + Network3D colors**  

- `ToolbarAtoms.tsx`: `zinc-*` → `--wn-control-bg`, active tool → `wn-accent`.  
- `PreviewAtoms.tsx`: border/loading zinc → semantic tokens.  
- `LoadingOverlay` default label → `t('preview.loading.label')` (or pass from parent).  
- `Network3D.tsx` ~2029 edit badge: `bg-wn-accent` or `--wn-scene-badge`.

**Step 24 — Fix `UNUSED_COMPONENTS.md`**  

- Remove `textarea.tsx` from delete list (used by `ContentTab.tsx`).  
- Note `sonner.tsx` unused until `<Toaster />` mounted (Phase 5 or wire later).

**Step 25 — Menubar sub-trigger scope (P3)**  

- Revert global `ui/menubar.tsx` `text-xs` if other submenus regressed; scope to language submenu or add `TopBarMenuSubTrigger`.

---

### Block G — Shell composer (Phase 2.3 debt)

**Step 26 — Slim `App.tsx` (target ≤150 lines)** (decision locked, §0)

Current size: 357 lines. Target: ≤150. Original `plan.md` ≤100 deferred to post–Phase 5.

- Keep `AppShell` in `main.tsx` (cursor + shell wrapper).
- Move-only first commit; **no behavior change** — pure code relocation, no logic edits.
- Hook extraction (`useAppTimelineBridge` etc.) allowed if it falls out naturally during the move, but NOT required. Do NOT create `AppWorkspace.tsx` unless the diff demands it; minimize new files.
- Prefer extracting effects/handlers into hooks over extracting JSX into new components — the goal is line reduction, not new abstractions.

Verification gate (the highest-risk single step in this plan):
- After commit: add a keyframe → play timeline → scrub → undo → redo → save → reload page → load.
- Resize sidebar handle → verify width persists across reload.
- Switch all 5 sidebar tabs → each renders.
- Run physics simulation → converges.
- `wc -l src/app/App.tsx` ≤ 150.

---

## Verification gates (run once after Step 26)

### Phase 1

- `grep -ri inspector src/` → 0  
- All sidebar numeric sliders click-to-type (Step 04)  
- `SidebarDivider` used on tab content (Step 05)

### Phase 2

- `rg '#[0-9a-fA-F]{6}' src/app/components/sidebar --glob '*.tsx'` → 0  
- No raw `zinc-`* color intent in `sidebar/` (Step 07) — semantic tokens only  
- Camera zoom uses `SidebarSliderRow` (Step 06)  
- Unified `--wn-accent` on toggles, keyframes, drag pucks (already true; re-check)

### Phase 3

- `rg '#[0-9a-fA-F]{6}' src/app/components --glob '*.tsx'` → only `ui/color-picker.tsx` (+ `timeline/types.ts` resolved in Step 22)  
- TopBar / Toolbar / Timeline header / Preview / ShortcutsDialog use `*Atoms.tsx`  
- No `indigo-*` / raw `blue-500` in topbar, toolbar, `Timeline.tsx`, preview, PathAnimator

### Phase 4

- DE / EN / Auto from View → Sprache — **no reload**  
- Shortcuts work in both languages; dialog labels translated  
- Context menu + ErrorBoundary + PathAnimator follow language  
- `de.json` / `en.json` key parity; no accidental English in DE bundle for core menus  
- `AGENTS.md` / `STYLE_GUIDE.md` match i18n approach (Step 20)

### Global

- `npm run build` && `npx tsc --noEmit`  
- Smoke: 5 sidebar tabs, sliders, physics keyframes, camera pucks, language switch

---

## Phase sign-off matrix


| Phase | Before remediation | Sign-off when                                     |
| ----- | ------------------ | ------------------------------------------------- |
| **1** | ~90%               | Steps 04–05, 09 optional, audit checklist Phase 1 |
| **2** | ~75%               | Steps 04, 06–08, audit checklist Phase 2          |
| **3** | ~70%               | Steps 21–24, audit checklist Phase 3              |
| **4** | ~85%               | Steps 10–20, audit checklist Phase 4              |
| **5** | Not started        | This plan complete + verification gates green     |


---

## Explicitly deferred (post–Phase 5 or optional)


| Item                                                     | Reason                        |
| -------------------------------------------------------- | ----------------------------- |
| Move `TrackRow` / `TrackGroup` into `TimelineAtoms.tsx`  | Large move, low ROI           |
| `DialogSection` / `DialogFooterRow`                      | No second dialog yet          |
| `RulerTick`, `GraphEditorHeader`, `TrackValueChip` atoms | Single-consumer; inlined OK   |
| Export public `SidebarRow`                               | Step 09 optional              |
| `Preview.tsx` CAM overlay i18n                           | Technical HUD; low priority   |
| `themeVar()` usage or removal                            | Cosmetic API                  |
| Delete orphan files, shadcn prune, full docs             | Phase 5                       |
| `wc -l App.tsx` ≤ 100                                    | Stretch goal; ≤150 in Step 26 |


---

## Quick reference: commit message format

```
pre-phase5.04: wire SidebarEditableNumber on slider rows
pre-phase5.10: normalize i18n language codes
```

One step per commit when possible; split large steps (e.g. 06) per file if diffs grow.
