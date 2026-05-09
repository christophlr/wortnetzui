# Wortnetzuimake — Claude guidance

## Version number

The version is **automatically derived from the git commit count** by `vite.config.ts` — no manual update needed.

- Format: `"0.XX"` where XX is `git rev-list --count HEAD` (e.g. 59 commits → `"0.59"`)
- Both the version and build timestamp are injected by Vite at build time via `__APP_VERSION__` and `__BUILD_DATE__`
- Build numbers are a per-commit sequence like `0.59.1`, `0.59.2`, and are injected via `__BUILD_NUMBER__`
- `src/version.ts` only contains type declarations — do not hardcode a version string there
- The version + build number + build timestamp are displayed in the bottom-left of the Preview component

## UI conventions

### Height and text scale — the h-6 baseline

`h-6` (24px) is the standard height for all inline UI controls in this app. The Menubar and TopBar toggle groups establish this as the baseline. **Do not make controls taller than `h-6` unless the element is a primary / full-width action** (e.g. the "Anwenden" submit button in the Inspector, which is the main action of a panel section).

This applies to:
- Segmented toggle groups (`ToggleGroup` / `ToggleGroupItem`)
- Inline buttons (icon buttons, label buttons like "Reset Defaults", "Exportieren")
- Accordion section headers (`AccSection` trigger)
- `Input` fields used inline in parameter rows

The same principle applies to **text**: prefer `text-[11px]` or `text-xs` for panel labels, captions, and control text. `text-sm` (14px) is acceptable only for body/description text in larger content areas.

Components that enforce this by default in this project:
- `Menubar` — ships at `h-6` with `text-[11px]` triggers
- `AccordionContent` — set to `text-xs`
- `MenubarItem` / `MenubarRadioItem` / `MenubarLabel` — set to `text-xs` / `py-1`

### Sliders with a numeric value (`SliderParam`)

Every `SliderParam` that shows a numeric value on the right **must** support click-to-type editing:

- The number display is rendered as a `<button>` that opens an inline `<input>` on click.
- Commit on **Enter**, **Tab**, or blur. Cancel on **Escape**.
- Always clamp the committed value to `[min, max]`.
- If the slider uses a scale factor (e.g. displayed value = raw × 10), pass a `parseInput` prop that inverts the scale: `parseInput={s => Math.round(parseFloat(s) / 10)}`.
- Never use a plain `<span>` for a numeric slider value — it must always be interactive.

This pattern is implemented in `src/app/components/Inspector.tsx → SliderParam`.
