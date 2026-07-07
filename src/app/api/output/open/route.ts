import { spawn } from "node:child_process";
import { NextResponse } from "next/server";
import { getGenerationOrThrow } from "@/lib/generation-store";
import { canOpenLocalOutputFolder } from "@/lib/runtime";

export async function POST(request: Request) {
  try {
    if (!canOpenLocalOutputFolder()) {
      return NextResponse.json({ message: "Opening a desktop output folder is only available in local mode." }, { status: 400 });
    }

    const payload = (await request.json()) as { generationId?: string };
    if (!payload.generationId) {
      return NextResponse.json({ message: "generationId is required." }, { status: 400 });
    }

    const generation = await getGenerationOrThrow(payload.generationId);
    if (!generation.outputPath) {
      return NextResponse.json({ message: "This generation has no output folder yet." }, { status: 400 });
    }

    spawn("explorer.exe", [generation.outputPath], {
      detached: true,
      stdio: "ignore"
    }).unref();

    return NextResponse.json({ message: "Output folder opened." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open folder.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
