import { NextResponse } from "next/server";
import { canPersistApiKeyLocally } from "@/lib/runtime";
import { apiKeyPayloadSchema } from "@/lib/validators";
import { validateApiKey, writeLocalSettings } from "@/lib/settings";

export async function POST(request: Request) {
  try {
    if (!canPersistApiKeyLocally()) {
      return NextResponse.json(
        { message: "In Vercel, configure OPENAI_API_KEY in Project Settings instead of saving it from the UI." },
        { status: 400 }
      );
    }

    const payload = apiKeyPayloadSchema.parse(await request.json());
    await validateApiKey(payload.apiKey);
    await writeLocalSettings(payload.apiKey);

    return NextResponse.json({
      message: "OpenAI API key validated and stored locally in .env.local."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to validate API key.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
