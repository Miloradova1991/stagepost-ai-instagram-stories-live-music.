import fs from "node:fs/promises";
import OpenAI from "openai";
import { LOCAL_SETTINGS_PATH } from "@/lib/constants";
import { fileExists, resolveProjectPath } from "@/lib/fs-utils";
import { canPersistApiKeyLocally } from "@/lib/runtime";

function parseEnv(raw: string) {
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) return [line, ""];
        return [
          line.slice(0, separatorIndex).trim(),
          line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "")
        ];
      })
  );
}

export async function readLocalSettings() {
  if (!canPersistApiKeyLocally()) {
    return {
      apiKey: process.env.OPENAI_API_KEY ?? "",
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
    };
  }

  const settingsPath = resolveProjectPath(LOCAL_SETTINGS_PATH);
  const exists = await fileExists(settingsPath);

  if (!exists) {
    return {
      apiKey: process.env.OPENAI_API_KEY ?? "",
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
    };
  }

  const raw = await fs.readFile(settingsPath, "utf8");
  const parsed = parseEnv(raw);

  return {
    apiKey: parsed.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
    model: parsed.OPENAI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  };
}

export async function writeLocalSettings(apiKey: string) {
  if (!canPersistApiKeyLocally()) {
    throw new Error("On Vercel, set OPENAI_API_KEY in Project Settings instead of saving it from the UI.");
  }

  const settingsPath = resolveProjectPath(LOCAL_SETTINGS_PATH);
  const existing = (await fileExists(settingsPath)) ? parseEnv(await fs.readFile(settingsPath, "utf8")) : {};
  const model = existing.OPENAI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const databaseUrl = existing.DATABASE_URL ?? process.env.DATABASE_URL ?? "";
  const directUrl = existing.DIRECT_URL ?? process.env.DIRECT_URL ?? "";
  const blobToken = existing.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";

  const lines = [
    `OPENAI_API_KEY="${apiKey}"`,
    `OPENAI_MODEL="${model}"`,
    `DATABASE_URL="${databaseUrl}"`,
    `DIRECT_URL="${directUrl}"`,
    `BLOB_READ_WRITE_TOKEN="${blobToken}"`
  ];
  const nextValue = `${lines.join("\n")}\n`;
  await fs.writeFile(settingsPath, nextValue, "utf8");
}

export async function validateApiKey(apiKey: string) {
  const client = new OpenAI({ apiKey });
  await client.models.list();
  return true;
}
