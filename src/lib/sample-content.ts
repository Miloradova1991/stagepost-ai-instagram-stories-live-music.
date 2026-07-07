import { chunkText, formatDisplayDate } from "@/lib/utils";
import type { ContentDraft, EventFormData, Idea, SlideDraft } from "@/lib/types";

export function buildFallbackIdeas(input: EventFormData): Idea[] {
  const baseDate = formatDisplayDate(input.eventDate);
  return [
    {
      title: `${input.eventName}: the night everyone saves to their stories`,
      shortDescription: `An energetic pre-event angle built around ${input.artistName}, ${baseDate}, and a strong "don't miss it" hook.`
    },
    {
      title: `From first beat to final encore at ${input.location}`,
      shortDescription: `A venue-led carousel with atmosphere, schedule, and why the crowd should book now.`
    },
    {
      title: `${input.city} moodboard for a ${input.mood.toLowerCase()} ${input.eventType.toLowerCase()}`,
      shortDescription: `A stylish social set focused on visuals, summer energy, and audience aspiration.`
    },
    {
      title: `Why this ${input.eventType.toLowerCase()} belongs in your weekend plans`,
      shortDescription: `A benefit-driven storytelling angle tailored to people searching for where to go tonight.`
    },
    {
      title: `Book, dance, remember: the ${input.artistName} promo kit`,
      shortDescription: `A CTA-forward concept that works well for restaurants, bars, and booking-focused promotion.`
    }
  ];
}

function buildCarousel(input: EventFormData, ideaTitle: string): SlideDraft[] {
  const eventDate = formatDisplayDate(input.eventDate);
  const bodyChunks = chunkText(
    `${input.artistName} brings ${input.musicStyle} to ${input.city} with a ${input.mood.toLowerCase()} set made for ${input.targetAudience}.`,
    10
  );

  return [
    {
      type: "carousel",
      slideNumber: 1,
      title: "Save this night",
      subtitle: ideaTitle,
      body: `${input.eventName} lands on ${eventDate}.`,
      cta: "Save the date",
      imagePrompt: `Concert poster mood, neon stage lights, ${input.mood}, audience anticipation`
    },
    {
      type: "carousel",
      slideNumber: 2,
      title: input.artistName,
      subtitle: input.eventType,
      body: bodyChunks[0] ?? input.musicStyle,
      cta: "Bring your crew",
      imagePrompt: `Live musician with microphone, stylish crowd, ${input.musicStyle}`
    },
    {
      type: "carousel",
      slideNumber: 3,
      title: "Where we meet",
      subtitle: input.location,
      body: `${input.location}, ${input.city}`,
      cta: "Tag your plus one",
      imagePrompt: `Venue exterior and atmospheric entrance, nightlife, ${input.city}`
    },
    {
      type: "carousel",
      slideNumber: 4,
      title: "What the night feels like",
      subtitle: input.mood,
      body: bodyChunks[1] ?? "Live vocals, crowd energy, and your favorite sing-along moments.",
      cta: "Arrive early",
      imagePrompt: `Crowd singing, spotlights, warm haze, ${input.mood}`
    },
    {
      type: "carousel",
      slideNumber: 5,
      title: "Plan the evening",
      subtitle: `${eventDate} • ${input.eventTime}`,
      body: "Reserve, invite, and show up ready for the chorus.",
      cta: "Reserve your table",
      imagePrompt: `Checklist graphic, elegant night-out planning, branded layout`
    },
    {
      type: "carousel",
      slideNumber: 6,
      title: "See you there",
      subtitle: input.eventName,
      body: "Swipe back, send it to your group chat, and make it a night worth remembering.",
      cta: "Join us this Friday",
      imagePrompt: `Confetti lights, encore, social-media-ready concert wrap-up`
    }
  ];
}

function buildStories(input: EventFormData): SlideDraft[] {
  const eventDate = formatDisplayDate(input.eventDate);

  return [
    {
      type: "story",
      slideNumber: 1,
      title: input.eventName,
      subtitle: `${input.city} • ${input.eventTime}`,
      body: `${input.artistName} is bringing ${input.musicStyle.toLowerCase()} to your feed and your Friday night.`,
      cta: "Save this story",
      imagePrompt: `Vertical concert teaser, neon gradient, strong typography`
    },
    {
      type: "story",
      slideNumber: 2,
      title: "Tonight's vibe",
      subtitle: input.mood,
      body: `${eventDate} at ${input.location}. Expect a room full of movement, vocals, and camera-roll moments.`,
      cta: "Share with friends",
      imagePrompt: `Audience silhouettes, stage beams, energetic vertical composition`
    },
    {
      type: "story",
      slideNumber: 3,
      title: "Book now",
      subtitle: input.targetAudience,
      body: "Leave space for the location sticker and tap through before the best spots go.",
      cta: "Reserve your table",
      imagePrompt: `Minimal CTA story, bold brand gradient, booking reminder`
    }
  ];
}

export function buildFallbackDraft(input: EventFormData, idea: Idea): ContentDraft {
  const eventDate = formatDisplayDate(input.eventDate);
  const carouselSlides = buildCarousel(input, idea.title);
  const storySlides = buildStories(input);

  return {
    selectedTopic: idea.title,
    summary: `${input.eventName} content kit for ${input.artistName} in ${input.city}.`,
    carouselSlides,
    storySlides,
    texts: {
      instagram_caption: `${input.city}, this one is for your saved posts.\n\n${input.artistName} presents ${input.eventName} on ${eventDate} at ${input.location}. Expect ${input.musicStyle.toLowerCase()}, a ${input.mood.toLowerCase()} atmosphere, and the kind of live set that turns dinner plans into a full night out.\n\n${input.targetAudience}\n\n${carouselSlides.at(-1)?.cta ?? "Save the date."}`,
      telegram_post: `${input.eventName}\n${eventDate} • ${input.eventTime}\n${input.location}, ${input.city}\n\n${input.artistName} is preparing a ${input.mood.toLowerCase()} ${input.eventType.toLowerCase()} with ${input.musicStyle.toLowerCase()}.\n\n${input.targetAudience}\n\n${storySlides.at(-1)?.cta ?? "Book now"}`,
      poster_text: `${input.artistName}\n${input.eventName}\n${eventDate} • ${input.eventTime}\n${input.location}, ${input.city}`,
      hashtags: "#StagePostAI #LiveMusic #ConcertNight #RigaEvents #MusicLovers #FridayPlans #BookNow",
      cta: carouselSlides.at(-1)?.cta ?? "Save the date",
      thank_you_post: `Thank you, ${input.city}. ${input.eventName} was full of heart, movement, and unforgettable sing-along moments. If you were with us, tag your favorite memory. If you missed it, the next live night is already calling.`
    }
  };
}
