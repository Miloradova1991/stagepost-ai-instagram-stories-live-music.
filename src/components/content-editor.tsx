"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { GeneratedSlide, GeneratedText, Generation } from "@prisma/client";

type SlideState = {
  id?: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  body: string;
  cta?: string;
  imagePrompt?: string;
};

type TextState = Record<string, string>;

export function ContentEditor({
  generation,
  slides,
  texts
}: {
  generation: Generation;
  slides: GeneratedSlide[];
  texts: GeneratedText[];
}) {
  const router = useRouter();
  const [carouselSlides, setCarouselSlides] = useState<SlideState[]>(
    slides
      .filter((slide) => slide.type === "carousel")
      .map((slide) => ({
        id: slide.id,
        slideNumber: slide.slideNumber,
        title: slide.title,
        subtitle: slide.subtitle ?? "",
        body: slide.body,
        cta: slide.cta ?? "",
        imagePrompt: slide.imagePrompt ?? ""
      }))
  );
  const [storySlides, setStorySlides] = useState<SlideState[]>(
    slides
      .filter((slide) => slide.type === "story")
      .map((slide) => ({
        id: slide.id,
        slideNumber: slide.slideNumber,
        title: slide.title,
        subtitle: slide.subtitle ?? "",
        body: slide.body,
        cta: slide.cta ?? "",
        imagePrompt: slide.imagePrompt ?? ""
      }))
  );
  const [textState, setTextState] = useState<TextState>(
    texts.reduce<TextState>((accumulator, text) => {
      accumulator[text.type] = text.content;
      return accumulator;
    }, {})
  );
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState<"save" | "images" | "regenerate" | null>(null);

  const payload = {
    carouselSlides,
    storySlides,
    texts: {
      instagram_caption: textState.instagram_caption ?? "",
      telegram_post: textState.telegram_post ?? "",
      poster_text: textState.poster_text ?? "",
      hashtags: textState.hashtags ?? "",
      cta: textState.cta ?? "",
      thank_you_post: textState.thank_you_post ?? ""
    }
  };

  async function saveContent() {
    setBusyAction("save");
    setMessage("");
    const response = await fetch(`/api/generations/${generation.id}/content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setBusyAction(null);
    setMessage(data.message ?? "Content saved.");
  }

  async function generateImages() {
    setBusyAction("images");
    setMessage("");
    await fetch(`/api/generations/${generation.id}/content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const response = await fetch(`/api/generations/${generation.id}/images`, { method: "POST" });
    const data = await response.json();
    setBusyAction(null);
    if (response.ok) {
      router.push(`/results/${data.id}`);
      return;
    }
    setMessage(data.message ?? "Unable to render images.");
  }

  async function regenerateText() {
    setBusyAction("regenerate");
    const response = await fetch(`/api/generations/${generation.id}/select-idea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId: "__selected__" })
    });
    const data = await response.json();
    setBusyAction(null);
    if (response.ok) {
      router.refresh();
      setMessage("Fresh text draft generated.");
      return;
    }
    setMessage(data.message ?? "Unable to regenerate text.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => startTransition(() => void saveContent())}
          disabled={busyAction !== null}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50"
        >
          {busyAction === "save" ? "Saving..." : "Save edits"}
        </button>
        <button
          type="button"
          onClick={() => startTransition(() => void regenerateText())}
          disabled={busyAction !== null}
          className="rounded-full border border-stage-cyan/30 bg-stage-cyan/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stage-cyan/20 disabled:opacity-50"
        >
          {busyAction === "regenerate" ? "Regenerating..." : "Regenerate text"}
        </button>
        <button
          type="button"
          onClick={() => startTransition(() => void generateImages())}
          disabled={busyAction !== null}
          className="rounded-full bg-gradient-to-r from-stage-violet via-stage-magenta to-stage-coral px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:shadow-glow disabled:opacity-50"
        >
          {busyAction === "images" ? "Rendering PNG..." : "Generate images"}
        </button>
      </div>

      {message ? <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stage-muted">{message}</p> : null}

      <SlideSection
        title="Instagram carousel"
        slides={carouselSlides}
        setSlides={setCarouselSlides}
        accent="text-stage-magenta"
      />
      <SlideSection title="Instagram stories" slides={storySlides} setSlides={setStorySlides} accent="text-stage-cyan" />

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries({
          instagram_caption: "Instagram caption",
          telegram_post: "Telegram announcement",
          poster_text: "Poster text",
          hashtags: "Suggested hashtags",
          cta: "CTA",
          thank_you_post: "After-event thank you post"
        }).map(([key, label]) => (
          <label key={key} className="space-y-2 rounded-[1.6rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-card">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
            <textarea
              value={textState[key] ?? ""}
              onChange={(event) => setTextState((current) => ({ ...current, [key]: event.target.value }))}
              className="min-h-40 w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-stage-violet/40"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function SlideSection({
  title,
  slides,
  setSlides,
  accent
}: {
  title: string;
  slides: SlideState[];
  setSlides: React.Dispatch<React.SetStateAction<SlideState[]>>;
  accent: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${accent}`}>{title}</p>
      </div>
      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <div key={`${slide.slideNumber}-${slide.id ?? index}`} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-3xl uppercase tracking-[0.05em] text-slate-900">
                Slide {slide.slideNumber}
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Title"
                value={slide.title}
                onChange={(value) => updateSlide(setSlides, index, { title: value })}
              />
              <Input
                label="Subtitle"
                value={slide.subtitle ?? ""}
                onChange={(value) => updateSlide(setSlides, index, { subtitle: value })}
              />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <TextArea
                label="Body"
                value={slide.body}
                onChange={(value) => updateSlide(setSlides, index, { body: value })}
              />
              <div className="space-y-3">
                <Input
                  label="CTA"
                  value={slide.cta ?? ""}
                  onChange={(value) => updateSlide(setSlides, index, { cta: value })}
                />
                <TextArea
                  label="Image prompt"
                  value={slide.imagePrompt ?? ""}
                  onChange={(value) => updateSlide(setSlides, index, { imagePrompt: value })}
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-stage-violet/40"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 6
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-stage-violet/40"
      />
    </label>
  );
}

function updateSlide(
  setSlides: React.Dispatch<React.SetStateAction<SlideState[]>>,
  index: number,
  patch: Partial<SlideState>
) {
  setSlides((current) => current.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)));
}
