import { ApiKeyForm } from "@/components/api-key-form";
import { AppShell } from "@/components/app-shell";
import { EventForm } from "@/components/event-form";
import { SectionCard } from "@/components/section-card";
import { canPersistApiKeyLocally, usesRemoteAssets } from "@/lib/runtime";
import { readLocalSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const deployedBrand = {
  name: "StagePost AI",
  visualStyle:
    "Bold concert-night editorial mixed with clean creator-tool UI, neon glow accents, soft gradients, rounded cards, crisp typography, and music-led motifs.",
  colors: {
    background: "#0A0A0F",
    surface: "#12131C",
    surfaceLight: "#F5F5FA",
    textPrimary: "#EEF2FF",
    textMuted: "#A4AEC8",
    electricViolet: "#835BFF",
    magenta: "#FF4FB8",
    cyan: "#5DE4FF",
    coral: "#FF8F6B"
  }
};

export default async function HomePage() {
  const canSaveApiKey = canPersistApiKeyLocally();
  const remoteAssets = usesRemoteAssets();
  const settings = canSaveApiKey
    ? await readLocalSettings()
    : {
        apiKey: process.env.OPENAI_API_KEY ?? "",
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
      };
  const brand = deployedBrand;

  return (
    <AppShell
      eyebrow="Home / New generation"
      title={remoteAssets ? "Concert content kits for web deployment" : "Concert content kits in one local flow"}
      description={
        remoteAssets
          ? "Generate ideas, shape captions and stories, and publish branded PNG slides with server-side OpenAI access, Postgres-backed history, and deployment-friendly asset storage."
          : "Generate five ideas, shape captions and stories, then export branded PNG slides for Instagram and Telegram without sending your API key anywhere except your local machine."
      }
      aside={
        <>
          <SectionCard>
            <ApiKeyForm hasApiKey={Boolean(settings.apiKey)} canSaveLocally={canSaveApiKey} />
          </SectionCard>
          <SectionCard>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">Brand system</p>
              <h2 className="font-display text-3xl uppercase tracking-[0.05em] text-white">{brand.name}</h2>
              <p className="text-sm leading-7 text-stage-muted">{brand.visualStyle}</p>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(brand.colors).slice(0, 8).map(([name, value]) => (
                  <div key={name} className="space-y-2">
                    <div className="h-12 rounded-2xl border border-white/10" style={{ backgroundColor: value }} />
                    <p className="text-[10px] uppercase tracking-[0.18em] text-stage-muted">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </>
      }
    >
      <SectionCard className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_320px]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">Event brief</p>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] text-white">
                Shape the promo before the first beat drops
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stage-muted">
                Choose event type, language, tone of voice, and all key concert details. StagePost AI then produces ideas, editable copy, branded story/carousel exports, and a reusable history in {remoteAssets ? "Postgres" : "local storage"}.
              </p>
            </div>
            <EventForm />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-magenta">What gets generated</p>
            <div className="mt-5 space-y-3">
              {[
                "Instagram captions with real CTA",
                "5 to 8 carousel slides",
                "3 to 5 Story-first scripts",
                "Telegram announcement",
                "Poster copy and hashtags",
                remoteAssets ? "Blob-hosted PNG export + Postgres history" : "Local PNG export + history"
              ].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
