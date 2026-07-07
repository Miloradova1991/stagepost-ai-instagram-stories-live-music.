import { prisma } from "@/lib/prisma";
import { renderGenerationImages } from "@/lib/image-renderer";
import { canOpenLocalOutputFolder } from "@/lib/runtime";
import type { ContentDraft, EventFormData, GenerationWithRelations, Idea } from "@/lib/types";

export async function createGeneration(input: EventFormData, ideas: Idea[]) {
  const generation = await prisma.generation.create({
    data: {
      ...input,
      status: "ideas_ready",
      ideas: {
        create: ideas
      }
    },
    include: {
      ideas: true,
      slides: true,
      texts: true
    }
  });

  return generation;
}

export async function getGeneration(id: string) {
  return prisma.generation.findUnique({
    where: { id },
    include: {
      ideas: true,
      slides: {
        orderBy: [{ type: "asc" }, { slideNumber: "asc" }]
      },
      texts: true
    }
  });
}

export async function getGenerationOrThrow(id: string) {
  const generation = await getGeneration(id);
  if (!generation) {
    throw new Error("Generation not found.");
  }
  return generation;
}

export async function listGenerations() {
  return prisma.generation.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      ideas: true,
      slides: true,
      texts: true
    }
  });
}

export async function saveGeneratedContent(id: string, draft: ContentDraft) {
  await prisma.$transaction([
    prisma.generatedSlide.deleteMany({
      where: { generationId: id }
    }),
    prisma.generatedText.deleteMany({
      where: { generationId: id }
    }),
    prisma.generation.update({
      where: { id },
      data: {
        selectedTopic: draft.selectedTopic,
        status: "content_ready",
        slides: {
          create: [...draft.carouselSlides, ...draft.storySlides]
        },
        texts: {
          create: Object.entries(draft.texts).map(([type, content]) => ({
            type,
            content
          }))
        }
      }
    })
  ]);

  return getGenerationOrThrow(id);
}

export async function updateEditedContent(id: string, draft: ContentDraft) {
  return saveGeneratedContent(id, draft);
}

export async function renderAndPersistGeneration(generation: GenerationWithRelations) {
  const rendered = await renderGenerationImages(generation);

  await prisma.$transaction([
    prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: "images_ready",
        outputPath: rendered.outputPath
      }
    }),
    ...rendered.updates.map((update) =>
      prisma.generatedSlide.update({
        where: { id: update.id },
        data: {
          finalImagePath: update.finalImagePath
        }
      })
    )
  ]);

  return getGenerationOrThrow(generation.id);
}

export async function duplicateGeneration(id: string) {
  const source = await getGenerationOrThrow(id);

  const duplicate = await prisma.generation.create({
    data: {
      artistName: source.artistName,
      eventName: `${source.eventName} Copy`,
      eventType: source.eventType,
      location: source.location,
      city: source.city,
      eventDate: source.eventDate,
      eventTime: source.eventTime,
      musicStyle: source.musicStyle,
      mood: source.mood,
      targetAudience: source.targetAudience,
      language: source.language,
      toneOfVoice: source.toneOfVoice,
      selectedTopic: source.selectedTopic,
      status: source.status,
      ideas: {
        create: source.ideas.map((idea) => ({
          title: idea.title,
          shortDescription: idea.shortDescription
        }))
      },
      slides: {
        create: source.slides.map((slide) => ({
          type: slide.type,
          slideNumber: slide.slideNumber,
          title: slide.title,
          subtitle: slide.subtitle ?? undefined,
          body: slide.body,
          cta: slide.cta ?? undefined,
          imagePrompt: slide.imagePrompt ?? undefined
        }))
      },
      texts: {
        create: source.texts.map((text) => ({
          type: text.type,
          content: text.content
        }))
      }
    },
    include: {
      ideas: true,
      slides: true,
      texts: true
    }
  });

  return duplicate;
}

export function getOutputFolderForUi(outputPath: string | null) {
  return canOpenLocalOutputFolder() ? outputPath : null;
}
