import type { BrandAsset, GeneratedIdea, GeneratedSlide, GeneratedText, Generation } from "@prisma/client";

export type EventFormData = Omit<
  Generation,
  "id" | "status" | "selectedTopic" | "createdAt" | "updatedAt" | "outputPath"
>;

export type Idea = Pick<GeneratedIdea, "title" | "shortDescription">;

export type SlideDraft = {
  type: "carousel" | "story";
  slideNumber: number;
  title: string;
  subtitle?: string;
  body: string;
  cta?: string;
  imagePrompt?: string;
};

export type TextDraft = {
  instagram_caption: string;
  telegram_post: string;
  poster_text: string;
  hashtags: string;
  cta: string;
  thank_you_post: string;
};

export type ContentDraft = {
  selectedTopic: string;
  summary: string;
  carouselSlides: SlideDraft[];
  storySlides: SlideDraft[];
  texts: TextDraft;
};

export type GenerationWithRelations = Generation & {
  ideas: GeneratedIdea[];
  slides: GeneratedSlide[];
  texts: GeneratedText[];
};

export type BrandConfig = {
  name: string;
  wordmark: string;
  logoPath: string;
  colors: Record<string, string>;
  typography: {
    display: string;
    body: string;
  };
  visualStyle: string;
  patterns: Record<string, string>;
};

export type BrandAssetRecord = BrandAsset;
