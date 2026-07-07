"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Generation } from "@prisma/client";
import { formatDisplayDate } from "@/lib/utils";

export function HistoryList({ generations }: { generations: Generation[] }) {
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("all");

  const filtered = useMemo(
    () =>
      generations.filter((generation) => {
        const matchesQuery =
          [generation.artistName, generation.eventName, generation.city]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesType = eventType === "all" || generation.eventType === eventType;
        return matchesQuery && matchesType;
      }),
    [eventType, generations, query]
  );

  const eventTypes = Array.from(new Set(generations.map((generation) => generation.eventType)));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by artist, event, city"
          className="w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-stage-muted focus:border-stage-cyan/50"
        />
        <select
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
          className="w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-stage-cyan/50"
        >
          <option value="all">All event types</option>
          {eventTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((generation) => (
          <div key={generation.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stage-cyan">{generation.eventType}</p>
                <h3 className="font-display text-3xl uppercase tracking-[0.05em] text-white">
                  {generation.artistName} / {generation.eventName}
                </h3>
                <p className="text-sm text-stage-muted">
                  {generation.city} • {generation.location} • {formatDisplayDate(generation.eventDate)} • {generation.eventTime}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/results/${generation.id}`}
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Open
                </Link>
                <Link
                  href={`/editor/${generation.id}`}
                  className="rounded-full border border-stage-cyan/30 bg-stage-cyan/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stage-cyan/20"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
