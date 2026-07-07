import type { GeneratedSlide, GeneratedText } from "@prisma/client";
import type { ContentDraft, TextDraft } from "@/lib/types";

export function textsToDraft(texts: GeneratedText[]): TextDraft {
  return {
    instagram_caption: texts.find((item) => item.type === "instagram_caption")?.content ?? "",
    telegram_post: texts.find((item) => item.type === "telegram_post")?.content ?? "",
    poster_text: texts.find((item) => item.type === "poster_text")?.content ?? "",
    hashtags: texts.find((item) => item.type === "hashtags")?.content ?? "",
    cta: texts.find((item) => item.type === "cta")?.content ?? "",
    thank_you_post: texts.find((item) => item.type === "thank_you_post")?.content ?? ""
  };
}

export function slidesToDraft(slides: GeneratedSlide[], selectedTopic: string): ContentDraft {
  return {
    selectedTopic,
    summary: selectedTopic,
    carouselSlides: slides
      .filter((slide) => slide.type === "carousel")
      .map((slide) => ({
        type: "carousel" as const,
        slideNumber: slide.slideNumber,
        title: slide.title,
        subtitle: slide.subtitle ?? undefined,
        body: slide.body,
        cta: slide.cta ?? undefined,
        imagePrompt: slide.imagePrompt ?? undefined
      })),
    storySlides: slides
      .filter((slide) => slide.type === "story")
      .map((slide) => ({
        type: "story" as const,
        slideNumber: slide.slideNumber,
        title: slide.title,
        subtitle: slide.subtitle ?? undefined,
        body: slide.body,
        cta: slide.cta ?? undefined,
        imagePrompt: slide.imagePrompt ?? undefined
      })),
    texts: {
      instagram_caption: "",
      telegram_post: "",
      poster_text: "",
      hashtags: "",
      cta: "",
      thank_you_post: ""
    }
  };
}
