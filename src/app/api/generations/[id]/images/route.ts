import { NextResponse } from "next/server";
import { getGenerationOrThrow, renderAndPersistGeneration } from "@/lib/generation-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const generation = await getGenerationOrThrow(id);

    if (generation.slides.length === 0) {
      return NextResponse.json({ message: "Generate content before rendering images." }, { status: 400 });
    }

    const updated = await renderAndPersistGeneration(generation);
    return NextResponse.json({ id: updated.id, outputPath: updated.outputPath });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to render images.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
