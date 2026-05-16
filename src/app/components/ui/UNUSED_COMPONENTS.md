# Unused Shadcn Components Audit
**Date:** 2026-05-16
**Command Used:** `grep -rl "ui/<name>" src/app/ --include="*.tsx" --include="*.ts" | grep -v "src/app/components/ui/"` and internal dependency checks.

The following Shadcn UI components are currently unused by the application and have no internal cross-dependencies from active components. They are safe to delete in Phase 5.2.

- accordion.tsx
- alert-dialog.tsx
- alert.tsx
- aspect-ratio.tsx
- avatar.tsx
- badge.tsx
- breadcrumb.tsx
- calendar.tsx
- card.tsx
- carousel.tsx
- chart.tsx
- checkbox.tsx
- collapsible.tsx
- command.tsx
- drawer.tsx
- dropdown-menu.tsx
- form.tsx
- hover-card.tsx
- input-otp.tsx
- label.tsx
- navigation-menu.tsx
- pagination.tsx
- resizable.tsx
- scroll-area.tsx
- select.tsx
- sonner.tsx
- spinner.tsx
- table.tsx
- tabs.tsx
- textarea.tsx

*(Note: `popover.tsx` is kept because it's used by `color-picker.tsx`. `toggle.tsx` is used by `toggle-group.tsx`. `use-mobile.ts`, `separator.tsx`, `sheet.tsx`, `skeleton.tsx`, and `tooltip.tsx` are used by `sidebar.tsx`.)*
