import { NextResponse } from "next/server";
import { getGenerationOrThrow, updateEditedContent } from "@/lib/generation-store";
import { saveContentSchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = saveContentSchema.parse(await request.json());
    const generation = await getGenerationOrThrow(id);

    await updateEditedContent(id, {
      selectedTopic: generation.selectedTopic ?? generation.ideas[0]?.title ?? generation.eventName,
      summary: generation.selectedTopic ?? generation.eventName,
      carouselSlides: payload.carouselSlides.map((slide) => ({ ...slide, type: "carousel" as const })),
      storySlides: payload.storySlides.map((slide) => ({ ...slide, type: "story" as const })),
      texts: payload.texts
    });

    return NextResponse.json({ message: "Content saved." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
