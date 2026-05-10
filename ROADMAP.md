# Wortnetze — Roadmap & Known Gaps

> **Read this file when planning new features or when your task touches something listed here.**
> If your task closes one of these gaps, update this file.

---

## Known Gaps

| Item | Status | Notes |
|---|---|---|
| **Export** | 🚧 Stub | `TopBar` renders the button; `onExport` is not wired in `App.tsx`. Planned: single image, image sequence (one PNG per frame), video. Do not implement without discussing format/codec first. |
| **Camera info overlay** | 🚧 Placeholder | `Preview` shows hardcoded `"CAM · POS 0 / 0 / 500"` etc. — not live data. |
| **Parse mode default mismatch** | ⚠️ Bug | `App.tsx` initialises `parseMode` to `'sentence'`; Inspector `RadioGroup` defaults to `'word'`. UI shows wrong selection until user clicks. |
| **Timeline Stop button** | ⚠️ Absent | `onStop` prop exists; transport renders "Go to start" (`SkipBack`) but doesn't stop playback. No dedicated Stop button. |

---

## Planned Migrations

| What | From | To | Why |
|---|---|---|---|
| (none) | | | |

---

## Completed (archive when done)

- **Arrow key camera pan**: Implemented in `Network3D.tsx` with shift-key multiplier.
- **Toolbar migration**: Moved from `Preview.tsx` to `App.tsx` viewport overlay.
- **Timeline Refactor**: Modularized architecture, visual easing icons, and Shadcn context menus.
- **3D Viewport Context Menu**: Standardized with Shadcn/Radix components.
