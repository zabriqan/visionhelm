import "server-only";
import { getStore } from "@netlify/blobs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
function store() {
  return getStore({ name: `visionhelm-media-${process.env.CONTEXT === "deploy-preview" ? "preview" : "production"}`, consistency: "strong", ...(process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN ? { siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN } : {}) });
}
export async function saveMedia(id: string, data: Buffer) {
  if (process.env.CONTENT_STORAGE === "netlify") { await store().set(id, new Uint8Array(data).buffer); return; }
  const directory = join(process.cwd(), ".editor-data", "media");
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, id), data);
}
export async function readMedia(id: string): Promise<Uint8Array | null> {
  if (process.env.CONTENT_STORAGE === "netlify") {
    const data = await store().get(id, { type: "arrayBuffer" });
    return data ? new Uint8Array(data) : null;
  }
  try { return new Uint8Array(await readFile(join(process.cwd(), ".editor-data", "media", id))); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
