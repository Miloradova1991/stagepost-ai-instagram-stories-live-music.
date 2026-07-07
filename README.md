# StagePost AI

StagePost AI is a Next.js app for generating Instagram captions, carousel copy, Stories, Telegram announcements, poster text, hashtags, CTA blocks, and branded PNG exports for concerts and live music events.

This version is prepared for both:

- local development
- Vercel deployment with hosted storage

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Postgres via Vercel Marketplace integration or any compatible Postgres provider
- OpenAI Node SDK
- Sharp for branded PNG rendering
- Vercel Blob for hosted image storage

## Features

- Event type, language, and tone-of-voice selectors
- 5 content ideas per generation
- Editable carousel slides, story slides, captions, Telegram post, poster text, hashtags, CTA, thank-you post
- Branded 1080x1080 carousel PNG export
- Branded 1080x1920 story PNG export
- Postgres-backed generation history
- Duplicate generation, regenerate text, regenerate images
- ZIP export of rendered assets
- Local desktop mode keeps `Open output folder`
- Hosted mode uses public image URLs from Blob storage

## Environment variables

Copy `.env.example` and provide:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=
DIRECT_URL=
BLOB_READ_WRITE_TOKEN=
```

### What each variable does

- `OPENAI_API_KEY`: server-side OpenAI key
- `OPENAI_MODEL`: default model
- `DATABASE_URL`: Prisma runtime database URL
- `DIRECT_URL`: direct Postgres URL for Prisma migrations
- `BLOB_READ_WRITE_TOKEN`: enables Vercel Blob uploads for generated PNG assets

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Run Prisma client generation:

```bash
pnpm db:generate
```

3. Apply migrations against your Postgres database:

```bash
pnpm exec prisma migrate deploy
```

4. Seed brand assets:

```bash
pnpm db:seed
```

5. Start development:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project from the repository.
3. Add a Postgres integration from the Vercel Marketplace.
4. Create a public Vercel Blob store and connect it to the project.
5. In Project Settings, set:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `BLOB_READ_WRITE_TOKEN`
6. Redeploy the project.
7. Run Prisma migrations against the production database before first real usage.

### Important note

Vercel Postgres itself is no longer offered for new projects. Use a Marketplace Postgres provider such as Neon and map its connection strings into `DATABASE_URL` and `DIRECT_URL`.

## Project structure

- `brand.config.json` - StagePost AI brand tokens
- `assets/brand/` - wordmark and decorative brand assets
- `prisma/` - schema, migration, seed
- `src/app/` - pages and route handlers
- `src/components/` - UI
- `src/lib/` - OpenAI services, Prisma access, renderer, storage helpers, deployment mode logic
- `output/` - local runtime generation exports in desktop mode
- `outputs/stagepost-sample-output/` - sample deliverable output

## Image export flow

The app uses OpenAI for content ideation and text generation, then renders final slides with SVG templates piped through Sharp into PNG files.

Storage behavior depends on environment:

- local mode: files are written into `output/`
- hosted mode: files are uploaded to Vercel Blob and stored as public URLs

## Sample output

Generate the bundled sample deliverable:

```bash
pnpm sample:output
```

This command is meant for local filesystem mode and creates a ready-to-review sample under `outputs/stagepost-sample-output/`.

## Notes

- `.env.local` is ignored by git.
- In hosted mode, the UI does not save API keys from the browser. The app expects `OPENAI_API_KEY` in deployment environment variables.
- The app falls back to deterministic local content if OpenAI is unavailable during generation.
- `vercel.json` is included for deployment compatibility.
