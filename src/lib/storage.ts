import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { OUTPUT_ROOT } from "@/lib/constants";
import { ensureDir, resolveProjectPath } from "@/lib/fs-utils";
import { isBlobStorageEnabled, isHostedDeployment, isRemoteAssetUrl } from "@/lib/runtime";

function assertHostedStorageReady() {
  if (isHostedDeployment() && !isBlobStorageEnabled()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Connect a Vercel Blob store before generating images in hosted mode.");
  }
}

export async function writeGeneratedAsset({
  pathname,
  content,
  contentType
}: {
  pathname: string;
  content: Buffer;
  contentType: string;
}) {
  assertHostedStorageReady();

  if (isBlobStorageEnabled()) {
    const blob = await put(pathname, content, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType
    });

    return {
      location: blob.url,
      storagePath: blob.pathname
    };
  }

  const absolutePath = resolveProjectPath(OUTPUT_ROOT, pathname);
  await ensureDir(path.dirname(absolutePath));
  await fs.writeFile(absolutePath, content);

  return {
    location: absolutePath,
    storagePath: absolutePath
  };
}

export async function writeManifest(pathname: string, manifest: object) {
  const buffer = Buffer.from(JSON.stringify(manifest, null, 2), "utf8");
  return writeGeneratedAsset({
    pathname,
    content: buffer,
    contentType: "application/json"
  });
}

export async function readStoredAsset(location: string) {
  if (isRemoteAssetUrl(location)) {
    const response = await fetch(location);
    if (!response.ok) {
      throw new Error(`Unable to download asset from ${location}.`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  return fs.readFile(location);
}
