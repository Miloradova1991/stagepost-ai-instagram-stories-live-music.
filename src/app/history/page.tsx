import { AppShell } from "@/components/app-shell";
import { HistoryList } from "@/components/history-list";
import { SectionCard } from "@/components/section-card";
import { listGenerations } from "@/lib/generation-store";
import { usesRemoteAssets } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const generations = await listGenerations();
  const remoteAssets = usesRemoteAssets();

  return (
    <AppShell
      eyebrow="History"
      title="Every generation stays reusable"
      description="Filter previous StagePost AI runs by artist, event type, or city, then reopen, edit, or duplicate any content pack."
      aside={
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">
            {remoteAssets ? "Stored for deployment" : "Stored locally"}
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">{generations.length} saved generations</h2>
          <p className="mt-3 text-sm leading-7 text-stage-muted">
            {remoteAssets
              ? "History is persisted in Postgres and rendered assets are stored in Vercel Blob-friendly public URLs."
              : "History is persisted locally and image files remain in the local output folder structure."}
          </p>
        </SectionCard>
      }
    >
      <SectionCard>
        <HistoryList generations={generations} />
      </SectionCard>
    </AppShell>
  );
}
