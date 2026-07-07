import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ContentEditor } from "@/components/content-editor";
import { SectionCard } from "@/components/section-card";
import { getGeneration } from "@/lib/generation-store";
import { formatDisplayDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const generation = await getGeneration(id);

  if (!generation) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Content editor"
      title="Refine every word before export"
      description="Edit carousel slides, story beats, captions, hashtags, poster copy, and CTA. Then render branded PNGs locally for delivery."
      aside={
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">Current brief</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">{generation.eventName}</h2>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stage-muted">
            <p>{generation.artistName}</p>
            <p>
              {formatDisplayDate(generation.eventDate)} • {generation.eventTime}
            </p>
            <p>
              {generation.location}, {generation.city}
            </p>
            <p>{generation.musicStyle}</p>
            <p>Tone: {generation.toneOfVoice}</p>
          </div>
        </SectionCard>
      }
    >
      <ContentEditor generation={generation} slides={generation.slides} texts={generation.texts} />
    </AppShell>
  );
}
