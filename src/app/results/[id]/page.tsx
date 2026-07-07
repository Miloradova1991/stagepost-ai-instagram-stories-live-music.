import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ResultGallery } from "@/components/result-gallery";
import { SectionCard } from "@/components/section-card";
import { getGeneration, getOutputFolderForUi } from "@/lib/generation-store";
import { formatDisplayDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const generation = await getGeneration(id);

  if (!generation) {
    notFound();
  }

  const outputLabel = getOutputFolderForUi(generation.outputPath) ?? generation.outputPath ?? "Not rendered yet";

  return (
    <AppShell
      eyebrow="Results"
      title="Preview, copy, and export the final pack"
      description="Carousel and Story assets are rendered as branded PNGs, stored in deployment-friendly storage, and kept ready for download and reuse."
      aside={
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">Output details</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">{generation.eventName}</h2>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stage-muted">
            <p>{generation.artistName}</p>
            <p>
              {formatDisplayDate(generation.eventDate)} • {generation.eventTime}
            </p>
            <p>
              {generation.location}, {generation.city}
            </p>
            <p>Status: {generation.status}</p>
            <p>Output: {outputLabel}</p>
          </div>
        </SectionCard>
      }
    >
      <ResultGallery
        generation={generation}
        slides={generation.slides}
        texts={generation.texts}
        canOpenOutputFolder={Boolean(getOutputFolderForUi(generation.outputPath))}
      />
    </AppShell>
  );
}
