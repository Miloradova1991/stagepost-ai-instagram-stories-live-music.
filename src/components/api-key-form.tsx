"use client";

import { useState, useTransition } from "react";

export function ApiKeyForm({
  hasApiKey,
  canSaveLocally
}: {
  hasApiKey: boolean;
  canSaveLocally: boolean;
}) {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState(
    canSaveLocally
      ? hasApiKey
        ? "API key already saved locally."
        : ""
      : hasApiKey
        ? "OPENAI_API_KEY is already configured in deployment environment variables."
        : "Set OPENAI_API_KEY in Vercel Project Settings before generating."
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stage-cyan">
          {canSaveLocally ? "Local OpenAI Settings" : "Deployment OpenAI Settings"}
        </p>
        <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-white">
          {canSaveLocally ? "Secure local API key" : "Server-managed API key"}
        </h2>
        <p className="mt-2 text-sm text-stage-muted">
          {canSaveLocally
            ? "The key is stored only in .env.local on this machine and is never exposed in UI logs."
            : "In Vercel, set OPENAI_API_KEY in Project Settings so the server can generate content without saving secrets from the UI."}
        </p>
      </div>

      {canSaveLocally ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              setMessage("");
              const response = await fetch("/api/settings/api-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey })
              });
              const data = await response.json();
              setMessage(data.message);
              if (response.ok) {
                setApiKey("");
              }
            });
          }}
        >
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-stage-muted focus:border-stage-cyan/50"
          />
          <button
            type="submit"
            disabled={isPending || !apiKey}
            className="w-full rounded-full bg-gradient-to-r from-stage-violet via-stage-magenta to-stage-coral px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Validating and saving..." : "Save OpenAI API key"}
          </button>
        </form>
      ) : null}

      {message ? <p className="text-sm text-stage-muted">{message}</p> : null}
    </div>
  );
}
