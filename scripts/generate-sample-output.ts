import fs from "node:fs/promises";
import path from "node:path";
import { buildFallbackDraft, buildFallbackIdeas } from "@/lib/sample-content";
import { renderGenerationImages } from "@/lib/image-renderer";
import { ensureDir, resolveProjectPath } from "@/lib/fs-utils";
import { usesRemoteAssets } from "@/lib/runtime";
import type { GenerationWithRelations } from "@/lib/types";

async function main() {
  if (usesRemoteAssets()) {
    throw new Error("sample:output is intended for local filesystem mode. Disable Blob storage before running it.");
  }

  const input = {
    artistName: "Vicky Knows Better",
    eventName: "Summer Live Concert",
    eventType: "Live concert",
    location: "Restaurant / Bar / Outdoor stage",
    city: "Riga",
    eventDate: "2026-07-18",
    eventTime: "20:00",
    musicStyle: "Pop covers, dance hits, live band",
    mood: "Energetic, emotional, summer, stylish",
    targetAudience:
      "People looking for a vibrant evening out, artist followers, and restaurant guests who love live music",
    language: "English",
    toneOfVoice: "energetic"
  } as const;

  const selectedIdea = buildFallbackIdeas(input)[0];
  const draft = buildFallbackDraft(input, selectedIdea);

  const generation: GenerationWithRelations = {
    id: "sample-stagepost-output",
    artistName: input.artistName,
    eventName: input.eventName,
    eventType: input.eventType,
    location: input.location,
    city: input.city,
    eventDate: input.eventDate,
    eventTime: input.eventTime,
    musicStyle: input.musicStyle,
    mood: input.mood,
    targetAudience: input.targetAudience,
    language: input.language,
    toneOfVoice: input.toneOfVoice,
    selectedTopic: draft.selectedTopic,
    status: "images_ready",
    outputPath: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ideas: [
      {
        id: "idea-sample",
        generationId: "sample-stagepost-output",
        title: selectedIdea.title,
        shortDescription: selectedIdea.shortDescription
      }
    ],
    slides: [...draft.carouselSlides, ...draft.storySlides].map((slide) => ({
      id: `${slide.type}-${slide.slideNumber}`,
      generationId: "sample-stagepost-output",
      type: slide.type,
      slideNumber: slide.slideNumber,
      title: slide.title,
      subtitle: slide.subtitle ?? null,
      body: slide.body,
      cta: slide.cta ?? null,
      imagePrompt: slide.imagePrompt ?? null,
      finalImagePath: null
    })),
    texts: Object.entries(draft.texts).map(([type, content]) => ({
      id: type,
      generationId: "sample-stagepost-output",
      type,
      content
    }))
  };

  const rendered = await renderGenerationImages(generation);
  const deliverableDir = resolveProjectPath("outputs", "stagepost-sample-output");

  await ensureDir(deliverableDir);
  await fs.cp(rendered.outputPath, deliverableDir, { recursive: true, force: true });
  await fs.writeFile(
    path.join(deliverableDir, "sample-texts.json"),
    JSON.stringify(draft.texts, null, 2),
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
