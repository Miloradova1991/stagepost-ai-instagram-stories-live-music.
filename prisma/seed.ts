import { prisma } from "@/lib/prisma";

async function main() {
  const assets = [
    {
      type: "logo",
      name: "StagePost AI Wordmark",
      path: "/assets/brand/logo-wordmark.svg",
      metadata: JSON.stringify({ variant: "primary" })
    },
    {
      type: "icon",
      name: "Sound Wave",
      path: "/assets/brand/icons-sound-wave.svg",
      metadata: JSON.stringify({ category: "music" })
    },
    {
      type: "pattern",
      name: "Spotlights",
      path: "/assets/brand/pattern-spotlights.svg",
      metadata: JSON.stringify({ category: "background" })
    }
  ];

  for (const asset of assets) {
    await prisma.brandAsset.upsert({
      where: { path: asset.path },
      update: asset,
      create: asset
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
