import { z } from "zod";

export const generationInputSchema = z.object({
  artistName: z.string().min(2),
  eventName: z.string().min(2),
  eventType: z.string().min(2),
  location: z.string().min(2),
  city: z.string().min(2),
  eventDate: z.string().min(4),
  eventTime: z.string().min(2),
  musicStyle: z.string().min(2),
  mood: z.string().min(2),
  targetAudience: z.string().min(2),
  language: z.string().min(2),
  toneOfVoice: z.string().min(2)
});

export const apiKeyPayloadSchema = z.object({
  apiKey: z.string().min(20)
});

export const selectIdeaSchema = z.object({
  ideaId: z.string().min(1)
});

export const saveContentSchema = z.object({
  carouselSlides: z.array(
    z.object({
      id: z.string().optional(),
      slideNumber: z.number().int(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
      body: z.string().min(1),
      cta: z.string().optional(),
      imagePrompt: z.string().optional()
    })
  ),
  storySlides: z.array(
    z.object({
      id: z.string().optional(),
      slideNumber: z.number().int(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
      body: z.string().min(1),
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
