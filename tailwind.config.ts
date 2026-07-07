import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        stage: {
          bg: "#0A0A0F",
          panel: "#12131C",
          card: "#F5F5FA",
          ink: "#EEF2FF",
          muted: "#A4AEC8",
          violet: "#835BFF",
          magenta: "#FF4FB8",
          cyan: "#5DE4FF",
          coral: "#FF8F6B"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(131, 91, 255, 0.15), 0 30px 80px rgba(20, 16, 42, 0.45)",
        card: "0 18px 60px rgba(8, 10, 18, 0.14)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        "stage-grid":
          "radial-gradient(circle at top, rgba(131,91,255,0.18), transparent 35%), linear-gradient(135deg, rgba(255,79,184,0.12), transparent 35%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        "stage-grid": "auto, auto, 36px 36px, 36px 36px"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
