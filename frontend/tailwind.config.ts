import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090b0f",
        surface: "#0f1117",
        "surface-2": "#161b24",
        "surface-3": "#1c2230",
        border: "rgba(99,120,155,0.14)",
        "border-strong": "rgba(99,120,155,0.28)",
        foreground: "#e2e8f4",
        "foreground-muted": "#8b95a8",
        "foreground-subtle": "#4e5668",
        accent: "#4f7ef8",
        "accent-2": "#6b95ff",
        "accent-glow": "rgba(79,126,248,0.15)",
        success: "#34c48b",
        "success-dim": "rgba(52,196,139,0.12)",
        warning: "#f5a623",
        "warning-dim": "rgba(245,166,35,0.12)",
        danger: "#f06565",
        "danger-dim": "rgba(240,101,101,0.12)",
        muted: "#8b95a8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "panel-sm": "0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,120,155,0.1)",
        panel: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,120,155,0.1)",
        "panel-lg": "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,120,155,0.12)",
        glow: "0 0 24px rgba(79,126,248,0.25)",
        "glow-sm": "0 0 12px rgba(79,126,248,0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-subtle":
          "linear-gradient(rgba(99,120,155,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,120,155,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-left": "slideInLeft 0.3s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
