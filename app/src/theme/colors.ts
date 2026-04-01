/**
 * Semantic color tokens for the project.
 * Change values here to retheme the entire app — no hunting through component files.
 *
 * These are mapped to Tailwind utility classes in tailwind.config.ts.
 * Usage in JSX: className="bg-app-bg text-text-primary"
 */

export const colors = {
  // ─── Backgrounds ──────────────────────────────────────────────────────────
  background: {
    app:   "#F9FAFB",   // page background
    card:  "#FFFFFF",   // card / surface background
    muted: "#F3F4F6",   // subtle section background
  },

  // ─── Text ─────────────────────────────────────────────────────────────────
  text: {
    primary:   "#111827",  // headings, body
    secondary: "#6B7280",  // labels, captions
    muted:     "#9CA3AF",  // placeholders, disabled
    inverted:  "#FFFFFF",  // text on dark backgrounds
    danger:    "#DC2626",  // error messages
  },

  // ─── Actions (buttons, links, interactive elements) ───────────────────────
  action: {
    primary: {
      base:  "#2563EB",  // primary button bg
      hover: "#1D4ED8",  // primary button hover
      text:  "#FFFFFF",  // text on primary button
    },
    secondary: {
      base:  "#F3F4F6",  // secondary button bg
      hover: "#E5E7EB",  // secondary button hover
      text:  "#111827",  // text on secondary button
    },
    danger: {
      base:  "#DC2626",
      hover: "#B91C1C",
      text:  "#FFFFFF",
    },
    disabled: {
      background: "#E5E7EB",
      text:       "#9CA3AF",
    },
  },

  // ─── Borders ──────────────────────────────────────────────────────────────
  border: {
    default: "#E5E7EB",
    focus:   "#2563EB",
    danger:  "#DC2626",
  },

  // ─── Status ───────────────────────────────────────────────────────────────
  status: {
    success: "#16A34A",
    warning: "#D97706",
    error:   "#DC2626",
    info:    "#2563EB",
  },
} as const;
