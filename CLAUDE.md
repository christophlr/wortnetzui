# Wortnetzuimake — Claude guidance

## Version number

**Every commit must bump the version in `src/version.ts`.**

- Format: `"0.XX"` where XX is the commit count (e.g. commit 54 → `"0.54"`)
- The build date is injected automatically by Vite at build time — no manual update needed
- Current commit count as of initial versioning: 53 (version `"0.53"`)
- The version + build timestamp are displayed in the bottom-left of the Preview component

## UI conventions

### Sliders with a numeric value (`SliderParam`)

Every `SliderParam` that shows a numeric value on the right **must** support click-to-type editing:

- The number display is rendered as a `<button>` that opens an inline `<input>` on click.
- Commit on **Enter**, **Tab**, or blur. Cancel on **Escape**.
- Always clamp the committed value to `[min, max]`.
- If the slider uses a scale factor (e.g. displayed value = raw × 10), pass a `parseInput` prop that inverts the scale: `parseInput={s => Math.round(parseFloat(s) / 10)}`.
- Never use a plain `<span>` for a numeric slider value — it must always be interactive.

This pattern is implemented in `src/app/components/Inspector.tsx → SliderParam`.
