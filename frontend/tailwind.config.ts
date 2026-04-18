import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0c0a08",
        surface: "#1a1612",
        border: "#342a20",
        foreground: "#e8ddd0",
        muted: "#a39080",
        accent: "#c8934a",
        success: "#7ab88a",
        warning: "#d3a563",
        danger: "#c47a72"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "IBM Plex Sans", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"]
      },
      boxShadow: {
        panel: "0 24px 70px rgba(0, 0, 0, 0.24)"
      }
    }
  },
  plugins: []
} satisfies Config;
