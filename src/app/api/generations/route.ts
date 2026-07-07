import { NextResponse } from "next/server";
import { createGeneration } from "@/lib/generation-store";
import { generateContentIdeas } from "@/lib/openai";
import { generationInputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = generationInputSchema.parse(await request.json());
    const ideas = await generateContentIdeas(payload);
    const generation = await createGeneration(payload, ideas);

    return NextResponse.json({ id: generation.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate ideas.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
