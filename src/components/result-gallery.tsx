"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GeneratedSlide, GeneratedText, Generation } from "@prisma/client";
import { CopyButton } from "@/components/copy-button";
import { isRemoteAssetUrl } from "@/lib/runtime";

export function ResultGallery({
  generation,
  slides,
  texts,
  canOpenOutputFolder
}: {
  generation: Generation;
  slides: GeneratedSlide[];
  texts: GeneratedText[];
  canOpenOutputFolder: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const textMap = texts.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.type] = item.content;
    return accumulator;
  }, {});

  const carouselSlides = slides.filter((slide) => slide.type === "carousel");
  const storySlides = slides.filter((slide) => slide.type === "story");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {canOpenOutputFolder ? (
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                await fetch("/api/output/open", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ generationId: generation.id })
                });
              })
            }
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Open output folder
          </button>
        ) : null}
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              const response = await fetch(`/api/generations/${generation.id}/images`, { method: "POST" });
              const data = await response.json();
              if (response.ok) {
                router.refresh();
              } else {
                window.alert(data.message ?? "Image regeneration failed.");
              }
            })
          }
          className="rounded-full border border-stage-cyan/30 bg-stage-cyan/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stage-cyan/20"
        >
          {isPending ? "Working..." : "Regenerate images"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/editor/${generation.id}`)}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Edit text
        </button>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              const response = await fetch(`/api/generations/${generation.id}/duplicate`, { method: "POST" });
              const data = await response.json();
              if (response.ok) {
                router.push(`/editor/${data.id}`);
              }
            })
          }
          className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Duplicate generation
        </button>
        <a
          href={`/api/generations/${generation.id}/download`}
          className="rounded-full bg-gradient-to-r from-stage-violet via-stage-magenta to-stage-coral px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          Download images
        </a>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GalleryColumn title="Carousel images" slides={carouselSlides} />
        <GalleryColumn title="Story images" slides={storySlides} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextPanel
          title="Instagram caption"
          value={textMap.instagram_caption ?? ""}
          action={<CopyButton label="Copy caption" value={textMap.instagram_caption ?? ""} />}
        />
        <TextPanel
          title="Telegram announcement"
          value={textMap.telegram_post ?? ""}
          action={<CopyButton label="Copy Telegram post" value={textMap.telegram_post ?? ""} />}
        />
        <TextPanel title="Poster text" value={textMap.poster_text ?? ""} />
        <TextPanel title="Hashtags" value={textMap.hashtags ?? ""} />
        <TextPanel title="CTA" value={textMap.cta ?? ""} />
        <TextPanel title="Thank you post" value={textMap.thank_you_post ?? ""} />
      </div>
    </div>
  );
}

function GalleryColumn({ title, slides }: { title: string; slides: GeneratedSlide[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {slides.map((slide) => (
          <div key={slide.id} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 p-3">
            {slide.finalImagePath ? (
              <img
                src={
                  isRemoteAssetUrl(slide.finalImagePath)
                    ? slide.finalImagePath
                    : `/api/files?path=${encodeURIComponent(slide.finalImagePath)}`
                }
                alt={slide.title}
                className="w-full rounded-[1.2rem] object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-[1.2rem] bg-black/20 text-sm text-stage-muted">
                Image pending
              </div>
            )}
            <div className="mt-3">
              <p className="font-display text-2xl uppercase tracking-[0.05em] text-white">{slide.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextPanel({
  title,
  value,
  action
}: {
  title: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl uppercase tracking-[0.05em] text-slate-900">{title}</h3>
        {action}
      </div>
      <pre className="whitespace-pre-wrap font-body text-sm leading-7 text-slate-700">{value}</pre>
    </div>
  );
}
