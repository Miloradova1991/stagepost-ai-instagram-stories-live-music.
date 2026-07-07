export const BRAND_CONFIG_PATH = "brand.config.json";
export const OUTPUT_ROOT = "output";
export const LOCAL_SETTINGS_PATH = ".env.local";

export const EVENT_TYPES = [
  "Live concert",
  "Restaurant performance",
  "Bar live music night",
  "Acoustic evening",
  "Cover band show",
  "Summer concert",
  "Beach party",
  "Private event",
  "Corporate event",
  "Wedding performance",
  "Festival performance",
  "After-event thank you post",
  "Booking promotion"
] as const;

export const LANGUAGE_OPTIONS = ["English", "Ukrainian", "Russian"] as const;

export const TONE_OPTIONS = [
  "elegant",
  "emotional",
  "energetic",
  "luxury",
  "friendly",
  "professional",
  "fun",
  "romantic",
  "party mood",
  "restaurant promo"
] as const;

export const TEXT_TYPES = [
  "instagram_caption",
  "telegram_post",
  "poster_text",
  "hashtags",
  "cta",
  "thank_you_post"
] as const;

export const CAROUSEL_TEMPLATES = [
  "Event announcement slide",
  "Hook slide",
  "Venue slide",
  "Date & time slide",
  "Why attend slide",
  "Music vibe slide",
  "Checklist slide",
  "CTA slide",
  "Booking promo slide"
] as const;

export const STORY_TEMPLATES = [
  "Story cover",
  "Story reminder",
  "Story CTA",
  "Thank you story"
] as const;

export const DEFAULT_EVENT_FORM = {
  artistName: "Vicky Knows Better",
  eventName: "Summer Live Concert",
  eventType: "Live concert",
  location: "Restaurant / Bar / Outdoor stage",
  city: "Riga",
  eventDate: "2026-07-18",
  eventTime: "20:00",
  musicStyle: "Pop covers, dance hits, live band",
  mood: "Energetic, emotional, summer, stylish",
  targetAudience:
    "People looking for a vibrant evening out, artist followers, and restaurant guests who love live music",
  language: "English",
  toneOfVoice: "energetic"
};
