import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { buildFallbackDraft, buildFallbackIdeas } from "@/lib/sample-content";
import { readLocalSettings } from "@/lib/settings";
import type { ContentDraft, EventFormData, Idea } from "@/lib/types";

const ideasSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      shortDescription: z.string()
    })
  )
});

const contentSchema = z.object({
  selectedTopic: z.string(),
  summary: z.string(),
  carouselSlides: z.array(
    z.object({
      type: z.literal("carousel"),
      slideNumber: z.number().int(),
      title: z.string(),
      subtitle: z.string().optional(),
      body: z.string(),
      cta: z.string().optional(),
      imagePrompt: z.string().optional()
    })
  ),
  storySlides: z.array(
    z.object({
      type: z.literal("story"),
      slideNumber: z.number().int(),
      title: z.string(),
      subtitle: z.string().optional(),
      body: z.string(),
      cta: z.string().optional(),
      imagePrompt: z.string().optional()
    })
  ),
  texts: z.object({
    instagram_caption: z.string(),
    telegram_post: z.string(),
    poster_text: z.string(),
    hashtags: z.string(),
    cta: z.string(),
    thank_you_post: z.string()
  })
});

function eventBrief(input: EventFormData) {
  return `
Artist / band: ${input.artistName}
Event name: ${input.eventName}
Event type: ${input.eventType}
City: ${input.city}
Venue: ${input.location}
Date: ${input.eventDate}
Time: ${input.eventTime}
Music style: ${input.musicStyle}
Mood: ${input.mood}
Target audience: ${input.targetAudience}
Language: ${input.language}
Tone of voice: ${input.toneOfVoice}
`.trim();
}

async function getClient() {
  const settings = await readLocalSettings();
  if (!settings.apiKey) {
    throw new Error("OpenAI API key is missing. Save it locally in Settings before generating.");
  }

  return {
    client: new OpenAI({ apiKey: settings.apiKey }),
    model: settings.model || "gpt-4o-mini"
  };
}

export async function generateContentIdeas(input: EventFormData): Promise<Idea[]> {
  try {
    const { client, model } = await getClient();
    const response = await client.beta.chat.completions.parse({
      model,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "You are a senior music-event social media strategist. Produce natural, non-generic, social-first content angles. Avoid robotic AI wording."
        },
        {
          role: "user",
          content: `Generate exactly 5 distinct content ideas for promoting this event.\n\n${eventBrief(input)}\n\nReturn concise, punchy ideas in the selected language.`
        }
      ],
      response_format: zodResponseFormat(ideasSchema, "stagepost_content_ideas")
    });

    return response.choices[0]?.message.parsed?.ideas.slice(0, 5) ?? buildFallbackIdeas(input);
  } catch {
    return buildFallbackIdeas(input);
  }
}

export async function generatePostContent(input: EventFormData, idea: Idea): Promise<ContentDraft> {
  try {
    const { client, model } = await getClient();
    const response = await client.beta.chat.completions.parse({
      model,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content:
            "You create premium Instagram, Stories, Telegram, and poster copy for musicians, venues, and event marketers. Keep it human, vivid, specific, and CTA-aware."
        },
        {
          role: "user",
          content: `Using the selected content idea below, generate a full editable content kit.\n\nSelected idea:\n${idea.title}\n${idea.shortDescription}\n\nEvent data:\n${eventBrief(input)}\n\nRequirements:\n- carouselSlides: 5 to 8 slides, short copy, hook on slide 1, CTA on final slide.\n- storySlides: 3 to 5 vertical stories adapted for stories, not copied from carousel.\n- texts: include instagram_caption, telegram_post, poster_text, hashtags, cta, thank_you_post.\n- imagePrompt on each slide should describe an atmospheric background concept.\n- Use the requested language and tone.\n- Avoid AI-sounding filler.`
        }
      ],
      response_format: zodResponseFormat(contentSchema, "stagepost_content_draft")
    });

    const parsed = response.choices[0]?.message.parsed;
    return parsed ? (parsed as ContentDraft) : buildFallbackDraft(input, idea);
  } catch {
    return buildFallbackDraft(input, idea);
  }
}

export async function generateImagePrompts(content: ContentDraft) {
  return [...content.carouselSlides, ...content.storySlides].map((slide) => ({
    type: slide.type,
    slideNumber: slide.slideNumber,
    prompt:
      slide.imagePrompt ??
      `${slide.title}. Modern live music promo background with neon lights, audience energy, and branded space for text.`
  }));
}

export async function generateBackgroundImage(_prompt: string) {
  return null;
}
