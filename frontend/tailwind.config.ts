import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09141d",
        surface: "#112131",
        border: "#25384a",
        foreground: "#f4f7fb",
        muted: "#8fa4bd",
        accent: "#38bdf8",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#f97316"
      },
      fontFamily: {
        display: ["Space Grotesk", "IBM Plex Sans", "Aptos Display", "sans-serif"],
        sans: ["IBM Plex Sans", "Aptos", "Segoe UI Variable", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "Consolas", "monospace"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(1, 7, 14, 0.48)"
      }
    }
  },
  plugins: []
} satisfies Config;
