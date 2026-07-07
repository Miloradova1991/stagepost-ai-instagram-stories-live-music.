import sharp from "sharp";
import { getBrandConfig } from "@/lib/brand";
import { resolveProjectPath } from "@/lib/fs-utils";
import { canOpenLocalOutputFolder } from "@/lib/runtime";
import { writeGeneratedAsset, writeManifest } from "@/lib/storage";
import { escapeXml, slugify } from "@/lib/utils";
import type { GenerationWithRelations } from "@/lib/types";

type SlideRecord = GenerationWithRelations["slides"][number];

function wrapLines(text: string, lineLength: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (`${current} ${word}`.trim().length > lineLength) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }

  if (current) lines.push(current);
  return lines;
}

function svgTemplate(params: {
  width: number;
  height: number;
  slide: SlideRecord;
  generation: GenerationWithRelations;
  caption: string;
}) {
  const { width, height, slide, generation, caption } = params;
  const isStory = slide.type === "story";
  const titleLines = wrapLines(slide.title, isStory ? 15 : 18);
  const bodyLines = wrapLines(slide.body, isStory ? 20 : 28).slice(0, isStory ? 4 : 3);
  const subtitle = slide.subtitle ? escapeXml(slide.subtitle) : "";
  const bodyY = isStory ? 720 : 490;
  const cta = slide.cta ? escapeXml(slide.cta) : "Join us";
  const safeBottom = isStory ? height - 280 : height - 140;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0A0A0F" />
        <stop offset="0.45" stop-color="#161225" />
        <stop offset="1" stop-color="#090A11" />
      </linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
        <stop stop-color="#835BFF" stop-opacity="0.9" />
        <stop offset="0.5" stop-color="#FF4FB8" stop-opacity="0.8" />
        <stop offset="1" stop-color="#5DE4FF" stop-opacity="0.8" />
      </linearGradient>
      <linearGradient id="chip" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#835BFF" />
        <stop offset="1" stop-color="#FF4FB8" />
      </linearGradient>
      <filter id="blur">
        <feGaussianBlur stdDeviation="48" />
      </filter>
    </defs>

    <rect width="${width}" height="${height}" rx="${isStory ? 72 : 54}" fill="url(#bg)" />
    <circle cx="${width * 0.18}" cy="${height * 0.16}" r="${isStory ? 240 : 180}" fill="#835BFF" fill-opacity="0.35" filter="url(#blur)" />
    <circle cx="${width * 0.78}" cy="${height * 0.18}" r="${isStory ? 220 : 160}" fill="#FF4FB8" fill-opacity="0.26" filter="url(#blur)" />
    <circle cx="${width * 0.58}" cy="${height * 0.84}" r="${isStory ? 260 : 200}" fill="#5DE4FF" fill-opacity="0.18" filter="url(#blur)" />
    <rect x="34" y="34" width="${width - 68}" height="${height - 68}" rx="${isStory ? 58 : 40}" stroke="rgba(255,255,255,0.12)" />
    <rect x="${isStory ? 74 : 58}" y="${isStory ? 88 : 58}" width="${isStory ? 272 : 216}" height="44" rx="22" fill="rgba(255,255,255,0.08)" />
    <text x="${isStory ? 104 : 82}" y="${isStory ? 118 : 88}" fill="#EEF2FF" font-size="18" font-family="Arial, sans-serif" letter-spacing="2.2" font-weight="700">STAGEPOST AI</text>

    <rect x="${isStory ? 74 : 58}" y="${isStory ? 170 : 148}" width="${isStory ? 318 : 272}" height="40" rx="20" fill="url(#chip)" />
    <text x="${isStory ? 106 : 86}" y="${isStory ? 196 : 175}" fill="#FFFFFF" font-size="17" font-family="Arial, sans-serif" letter-spacing="2.2" font-weight="700">${escapeXml(
      generation.eventType.toUpperCase()
    )}</text>

    ${titleLines
      .map(
        (line, index) => `
      <text x="${isStory ? 74 : 58}" y="${isStory ? 332 + index * 90 : 292 + index * 72}" fill="#F7F5FF" font-size="${isStory ? 74 : 62}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(
          line
        )}</text>`
      )
      .join("")}

    ${
      subtitle
        ? `<text x="${isStory ? 76 : 60}" y="${isStory ? 622 : 430}" fill="#D3C8FF" font-size="${
            isStory ? 28 : 24
          }" font-family="Arial, sans-serif" font-weight="600">${subtitle}</text>`
        : ""
    }

    ${bodyLines
      .map(
        (line, index) => `
      <text x="${isStory ? 76 : 60}" y="${bodyY + index * (isStory ? 50 : 42)}" fill="#EEF2FF" font-size="${
          isStory ? 34 : 28
        }" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
      )
      .join("")}

    <rect x="${isStory ? 76 : 60}" y="${safeBottom}" width="${isStory ? 360 : 288}" height="${
      isStory ? 86 : 70
    }" rx="${isStory ? 28 : 24}" fill="rgba(255,255,255,0.92)" />
    <text x="${isStory ? 110 : 92}" y="${safeBottom + (isStory ? 53 : 45)}" fill="#0A0A0F" font-size="${
      isStory ? 28 : 24
    }" font-family="Arial, sans-serif" font-weight="700">${cta}</text>

    ${
      isStory
        ? `<rect x="76" y="${height - 166}" width="420" height="122" rx="32" fill="rgba(255,255,255,0.08)" />
           <text x="104" y="${height - 120}" fill="#A4AEC8" font-size="20" font-family="Arial, sans-serif" letter-spacing="2">${escapeXml(
             caption
           )}</text>`
        : `<text x="${width - 138}" y="94" fill="#A4AEC8" font-size="22" font-family="Arial, sans-serif" font-weight="700">0${
            slide.slideNumber
          }</text>`
    }
  </svg>
  `;
}

export async function renderGenerationImages(generation: GenerationWithRelations) {
  const brand = await getBrandConfig();
  const generationSlug = `${generation.id}-${slugify(generation.eventName || generation.artistName)}`;
  const renderVersion = `render-${Date.now()}`;
  const basePrefix = `${generationSlug}/${renderVersion}`;
  const outputPath = canOpenLocalOutputFolder() ? resolveProjectPath("output", basePrefix) : basePrefix;
  const caption = `${generation.artistName} • ${generation.city}`;
  const updates: Array<{ id: string; finalImagePath: string }> = [];

  for (const slide of generation.slides.sort((left, right) => left.slideNumber - right.slideNumber)) {
    const width = 1080;
    const height = slide.type === "story" ? 1920 : 1080;
    const svg = svgTemplate({ width, height, slide, generation, caption: brand.wordmark });
    const fileName =
      slide.type === "story"
        ? `story-${String(slide.slideNumber).padStart(2, "0")}.png`
        : `carousel-${String(slide.slideNumber).padStart(2, "0")}.png`;
    const pathname = `${basePrefix}/${slide.type === "story" ? "stories" : "carousel"}/${fileName}`;
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    const stored = await writeGeneratedAsset({
      pathname,
      content: pngBuffer,
      contentType: "image/png"
    });

    updates.push({
      id: slide.id,
      finalImagePath: stored.location
    });
  }

  await writeManifest(`${basePrefix}/manifest.json`, {
    brand: brand.name,
    outputPath,
    generatedAt: new Date().toISOString(),
    event: {
      artistName: generation.artistName,
      eventName: generation.eventName,
      city: generation.city,
      location: generation.location,
      eventDate: generation.eventDate,
      eventTime: generation.eventTime
    }
  });

  return {
    outputPath,
    updates
  };
}
