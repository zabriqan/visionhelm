import "server-only";
import { readFile, mkdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getStore } from "@netlify/blobs";
import defaults from "@/content/site.json";
import { contentSchema, type SiteContent } from "./content-schema";

const file = join(process.cwd(), "src", "content", "site.json");
function configuredContent(value: unknown): SiteContent {
  const content = contentSchema.parse(value);
  const email = process.env.CONTACT_TO_EMAIL?.trim();
  if (!email) return content;
  return contentSchema.parse({ ...content, brand: { ...content.brand, email } });
}
function blobStore() {
  return getStore({ name: `visionhelm-content-${process.env.CONTEXT === "deploy-preview" ? "preview" : "production"}`, consistency: "strong", ...(process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN ? { siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN } : {}) });
}
export function storageAvailable() {
  return process.env.CONTENT_STORAGE === "netlify" || process.env.NODE_ENV === "development" || process.env.CONTENT_STORAGE === "file";
}
export async function getContent(): Promise<SiteContent> {
  if (process.env.CONTENT_STORAGE === "netlify") {
    // Build rendering uses the bundled content; live requests use durable site-scoped storage.
    if (process.env.NEXT_PHASE === "phase-production-build") return configuredContent(defaults);
    const saved = await blobStore().get("site", { type: "json" });
    return configuredContent(saved ?? defaults);
  }
  try { return configuredContent(JSON.parse(await readFile(file, "utf8"))); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return configuredContent(defaults);
    throw error;
  }
}
export async function saveContent(content: SiteContent) {
  const validated = contentSchema.parse(content);
  if (!storageAvailable()) throw new Error("Configure durable content storage before saving on this host.");
  if (process.env.CONTENT_STORAGE === "netlify") {
    await blobStore().setJSON("site", validated);
    return;
  }
  await mkdir(join(process.cwd(), ".editor-data"), { recursive: true });
  // Keep the previous successful revision for recovery; replace atomically.
  const previous = await readFile(file, "utf8");
  await writeFile(join(process.cwd(), ".editor-data", "site.previous.json"), previous);
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(validated, null, 2) + "\n");
  await rename(temporary, file);
}
