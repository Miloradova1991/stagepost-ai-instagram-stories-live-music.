import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { resolveProjectPath } from "@/lib/fs-utils";
import { usesRemoteAssets } from "@/lib/runtime";

export async function GET(request: Request) {
  try {
    if (usesRemoteAssets()) {
      return NextResponse.json({ message: "Local file proxy is disabled in hosted deployments." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get("path");

    if (!targetPath) {
      return NextResponse.json({ message: "File path is required." }, { status: 400 });
    }

    const projectRoot = resolveProjectPath();
    if (!targetPath.startsWith(projectRoot)) {
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    }

    const file = await fs.readFile(targetPath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/png"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read file.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
