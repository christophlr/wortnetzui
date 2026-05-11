# Wortnetze — Roadmap & Known Gaps

> **Read this file when planning new features or when your task touches something listed here.**
> If your task closes one of these gaps, update this file.

---

## Known Gaps

| Item | Status | Notes |
|---|---|---|
| **Export** | 🚧 Stub | `TopBar` renders the button; `onExport` is wired to `network3DRef.current?.exportPNG()`. Planned: image sequence, video. |
| **Camera info overlay** | 🚧 Placeholder | `Preview` shows hardcoded `"CAM · POS 0 / 0 / 500"` — not live data. |

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
- **Timeline Improvements**: Implemented multi-selection dragging for keyframes and markers, and interactive snapping to scene markers.
- **3D Viewport Context Menu**: Standardized with Shadcn/Radix components.
- **Modular Architecture Refactor**: Transitioned from monolithic `App.tsx` to a context-driven modular architecture (`WortnetzContext`, `AppShell`, `AppSidebar`, `AppCanvas`). Resolved state sync bugs (e.g., parse mode default mismatch) and wired up transport controls (e.g., Stop button).
