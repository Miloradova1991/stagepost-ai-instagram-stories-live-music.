"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_EVENT_FORM, EVENT_TYPES, LANGUAGE_OPTIONS, TONE_OPTIONS } from "@/lib/constants";
import type { EventFormData } from "@/lib/types";

type EventFormProps = {
  initialValues?: EventFormData;
};

export function EventForm({ initialValues }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const initialState = useMemo(() => initialValues ?? DEFAULT_EVENT_FORM, [initialValues]);
  const [form, setForm] = useState<EventFormData>(initialState);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setError("");
          const response = await fetch("/api/generations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          });
          const data = await response.json();
          if (!response.ok) {
            setError(data.message ?? "Failed to generate ideas.");
            return;
          }
          router.push(`/ideas/${data.id}`);
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Artist / band name">
          <input
            value={form.artistName}
            onChange={(event) => setForm((current) => ({ ...current, artistName: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Event name">
          <input
            value={form.eventName}
            onChange={(event) => setForm((current) => ({ ...current, eventName: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Event type">
          <select
            value={form.eventType}
            onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))}
            className={inputClass}
          >
            {EVENT_TYPES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Language">
          <select
            value={form.language}
            onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}
            className={inputClass}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Tone of voice">
          <select
            value={form.toneOfVoice}
            onChange={(event) => setForm((current) => ({ ...current, toneOfVoice: event.target.value }))}
            className={inputClass}
          >
            {TONE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="City">
          <input
            value={form.city}
            onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Venue / location">
          <input
            value={form.location}
            onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Music style">
          <input
            value={form.musicStyle}
            onChange={(event) => setForm((current) => ({ ...current, musicStyle: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={form.eventDate}
            onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Time">
          <input
            type="time"
            value={form.eventTime}
            onChange={(event) => setForm((current) => ({ ...current, eventTime: event.target.value }))}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Mood">
        <input
          value={form.mood}
          onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value }))}
          className={inputClass}
        />
      </Field>

      <Field label="Target audience">
        <textarea
          value={form.targetAudience}
          onChange={(event) => setForm((current) => ({ ...current, targetAudience: event.target.value }))}
          className={`${inputClass} min-h-28`}
        />
      </Field>

      {error ? <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-gradient-to-r from-stage-violet via-stage-magenta to-stage-coral px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Generating 5 ideas..." : "Generate 5 ideas"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stage-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stage-muted focus:border-stage-cyan/50";
