import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { IdeasPicker } from "@/components/ideas-picker";
import { SectionCard } from "@/components/section-card";
import { getGeneration } from "@/lib/generation-store";
import { formatDisplayDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function IdeasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const generation = await getGeneration(id);

  if (!generation) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Ideas"
      title="Choose the angle that deserves the spotlight"
      description="Five fresh campaign directions are ready. Pick one and StagePost AI will expand it into a complete editable social content kit."
      aside={
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">Event summary</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">{generation.eventName}</h2>
          <p className="mt-3 text-sm leading-7 text-stage-muted">
            {generation.artistName}
            <br />
            {formatDisplayDate(generation.eventDate)} • {generation.eventTime}
            <br />
            {generation.location}, {generation.city}
          </p>
        </SectionCard>
      }
    >
      <SectionCard>
        <IdeasPicker generationId={generation.id} ideas={generation.ideas} selectedTopic={generation.selectedTopic} />
      </SectionCard>
    </AppShell>
  );
}
