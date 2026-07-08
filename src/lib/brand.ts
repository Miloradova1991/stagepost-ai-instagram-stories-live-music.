import fs from "node:fs/promises";
import { BRAND_CONFIG_PATH } from "@/lib/constants";
import { fileExists, resolveProjectPath } from "@/lib/fs-utils";
import { isHostedDeployment } from "@/lib/runtime";
import type { BrandConfig } from "@/lib/types";

const defaultBrandConfig: BrandConfig = {
  name: "StagePost AI",
  wordmark: "StagePost AI",
  logoPath: "/assets/brand/logo-wordmark.svg",
  colors: {
    background: "#0A0A0F",
    surface: "#12131C",
    surfaceLight: "#F5F5FA",
    textPrimary: "#EEF2FF",
    textMuted: "#A4AEC8",
    electricViolet: "#835BFF",
    magenta: "#FF4FB8",
    cyan: "#5DE4FF",
    coral: "#FF8F6B"
  },
  typography: {
    display: "Bebas Neue",
    body: "Space Grotesk"
  },
  visualStyle:
    "Bold concert-night editorial mixed with clean creator-tool UI, neon glow accents, soft gradients, rounded cards, crisp typography, and music-led motifs.",
  patterns: {
    cards: "Rounded 28-32px cards with layered dark/light treatments",
    gradients: "Violet-magenta-cyan glows over graphite backgrounds",
    buttons: "Pill CTA buttons with neon outlines and subtle spotlight gradients",
    badges: "Rounded full badges with uppercase labels and light blur backgrounds",
    icons: "Minimal line icons inspired by stage lights, microphones, and waveforms",
    roundedBlocks: "Generous radius sections with inset strokes",
    darkSections: "Graphite surfaces with radial glow blooms",
    lightSections: "Warm-white cards for editable content zones"
  }
};

export async function ensureBrandConfig() {
  if (isHostedDeployment()) {
    return;
  }

  const configPath = resolveProjectPath(BRAND_CONFIG_PATH);
  const exists = await fileExists(configPath);
  if (!exists) {
    await fs.writeFile(configPath, JSON.stringify(defaultBrandConfig, null, 2), "utf8");
  }
}

export async function getBrandConfig() {
  if (isHostedDeployment()) {
    try {
      const configPath = resolveProjectPath(BRAND_CONFIG_PATH);
      const content = await fs.readFile(configPath, "utf8");
      return JSON.parse(content) as BrandConfig;
    } catch {
      return defaultBrandConfig;
    }
  }

  await ensureBrandConfig();
  const configPath = resolveProjectPath(BRAND_CONFIG_PATH);
  const content = await fs.readFile(configPath, "utf8");
  return JSON.parse(content) as BrandConfig;
}
}
