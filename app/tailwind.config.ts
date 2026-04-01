import type { Config } from "tailwindcss";
import { colors } from "./src/theme/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Backgrounds ────────────────────────────────────────────────────
        "app-bg":         colors.background.app,
        "app-bg-card":    colors.background.card,
        "app-bg-muted":   colors.background.muted,

        // ─── Text ───────────────────────────────────────────────────────────
        "text-primary":   colors.text.primary,
        "text-secondary": colors.text.secondary,
        "text-muted":     colors.text.muted,
        "text-inverted":  colors.text.inverted,
        "text-danger":    colors.text.danger,

        // ─── Actions ────────────────────────────────────────────────────────
        "action-primary":          colors.action.primary.base,
        "action-primary-hover":    colors.action.primary.hover,
        "action-primary-text":     colors.action.primary.text,
        "action-secondary":        colors.action.secondary.base,
        "action-secondary-hover":  colors.action.secondary.hover,
        "action-secondary-text":   colors.action.secondary.text,
        "action-danger":           colors.action.danger.base,
        "action-danger-hover":     colors.action.danger.hover,
        "action-disabled-bg":      colors.action.disabled.background,
        "action-disabled-text":    colors.action.disabled.text,

        // ─── Borders ────────────────────────────────────────────────────────
        "border-default": colors.border.default,
        "border-focus":   colors.border.focus,
        "border-danger":  colors.border.danger,

        // ─── Status ─────────────────────────────────────────────────────────
        "status-success": colors.status.success,
        "status-warning": colors.status.warning,
        "status-error":   colors.status.error,
        "status-info":    colors.status.info,
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
