import { NextResponse } from "next/server";
import { getGenerationOrThrow, saveGeneratedContent } from "@/lib/generation-store";
import { generatePostContent } from "@/lib/openai";
import type { GenerationWithRelations } from "@/lib/types";
import { selectIdeaSchema } from "@/lib/validators";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = selectIdeaSchema.parse(await request.json());
    const generation = await getGenerationOrThrow(id);
    const findIdeaBy = (predicate: (item: GenerationWithRelations["ideas"][number]) => boolean) =>
  generation.ideas.find(predicate);
  const idea =
  payload.ideaId === "__selected__"
    ? findIdeaBy((item) => item.title === generation.selectedTopic) ?? generation.ideas[0]
    : findIdeaBy((item) => item.id === payload.ideaId);

    if (!idea) {
      return NextResponse.json({ message: "Selected idea was not found." }, { status: 404 });
    }

    const draft = await generatePostContent(
      {
        artistName: generation.artistName,
        eventName: generation.eventName,
        eventType: generation.eventType,
        location: generation.location,
        city: generation.city,
        eventDate: generation.eventDate,
        eventTime: generation.eventTime,
        musicStyle: generation.musicStyle,
        mood: generation.mood,
        targetAudience: generation.targetAudience,
        language: generation.language,
        toneOfVoice: generation.toneOfVoice
      },
      {
        title: idea.title,
        shortDescription: idea.shortDescription
      }
    );

    await saveGeneratedContent(generation.id, draft);

    return NextResponse.json({ id: generation.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate content.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
