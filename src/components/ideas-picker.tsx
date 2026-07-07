"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GeneratedIdea } from "@prisma/client";

export function IdeasPicker({
  generationId,
  ideas,
  selectedTopic
}: {
  generationId: string;
  ideas: GeneratedIdea[];
  selectedTopic?: string | null;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(
    ideas.find((idea) => idea.title === selectedTopic)?.id ?? ideas[0]?.id ?? ""
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        {ideas.map((idea, index) => {
          const active = selectedId === idea.id;
          return (
            <button
              type="button"
              key={idea.id}
              onClick={() => setSelectedId(idea.id)}
              className={`rounded-[1.6rem] border p-5 text-left transition ${
                active
                  ? "border-stage-cyan/50 bg-stage-violet/15 shadow-glow"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stage-cyan">
                  Idea {index + 1}
                </span>
                {active ? <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Selected</span> : null}
              </div>
              <h3 className="font-display text-3xl uppercase tracking-[0.05em] text-white">{idea.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stage-muted">{idea.shortDescription}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={isPending || !selectedId}
        onClick={() =>
          startTransition(async () => {
            const response = await fetch(`/api/generations/${generationId}/select-idea`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ideaId: selectedId })
            });
            const data = await response.json();
            if (response.ok) {
              router.push(`/editor/${data.id}`);
            }
          })
        }
        className="w-full rounded-full bg-gradient-to-r from-stage-violet via-stage-magenta to-stage-coral px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Generating content..." : "Generate content"}
      </button>
    </div>
  );
}
