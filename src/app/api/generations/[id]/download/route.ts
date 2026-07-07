import AdmZip from "adm-zip";
import { NextResponse } from "next/server";
import { getGenerationOrThrow } from "@/lib/generation-store";
import { readStoredAsset } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const generation = await getGenerationOrThrow(id);

    if (generation.slides.length === 0) {
      return NextResponse.json({ message: "No rendered output available yet." }, { status: 400 });
    }

    const zip = new AdmZip();

    for (const slide of generation.slides) {
      if (!slide.finalImagePath) continue;
      const fileBuffer = await readStoredAsset(slide.finalImagePath);
      const fileName =
        slide.type === "story"
          ? `stories/story-${String(slide.slideNumber).padStart(2, "0")}.png`
          : `carousel/carousel-${String(slide.slideNumber).padStart(2, "0")}.png`;
      zip.addFile(fileName, fileBuffer);
    }

    zip.addFile(
      "manifest.json",
      Buffer.from(
        JSON.stringify(
          {
            generationId: generation.id,
            outputPath: generation.outputPath,
            artistName: generation.artistName,
            eventName: generation.eventName,
            eventType: generation.eventType,
            city: generation.city,
            location: generation.location,
            eventDate: generation.eventDate,
            eventTime: generation.eventTime,
            generatedAt: new Date().toISOString()
          },
          null,
          2
        ),
        "utf8"
      )
    );

    const buffer = zip.toBuffer();
    const fileName = `${generation.id}.zip`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create archive.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
