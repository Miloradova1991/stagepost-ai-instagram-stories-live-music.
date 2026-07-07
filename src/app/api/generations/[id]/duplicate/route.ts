import { NextResponse } from "next/server";
import { duplicateGeneration } from "@/lib/generation-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const duplicate = await duplicateGeneration(id);
    return NextResponse.json({ id: duplicate.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to duplicate generation.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
