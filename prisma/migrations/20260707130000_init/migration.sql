-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "eventTime" TEXT NOT NULL,
    "musicStyle" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "toneOfVoice" TEXT NOT NULL,
    "selectedTopic" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "outputPath" TEXT,
    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedIdea" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    CONSTRAINT "GeneratedIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedSlide" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slideNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT NOT NULL,
    "cta" TEXT,
    "imagePrompt" TEXT,
    "finalImagePath" TEXT,
    CONSTRAINT "GeneratedSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedText" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "GeneratedText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAsset" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metadata" TEXT,
    CONSTRAINT "BrandAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandAsset_path_key" ON "BrandAsset"("path");

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedSlide" ADD CONSTRAINT "GeneratedSlide_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedText" ADD CONSTRAINT "GeneratedText_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
