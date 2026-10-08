import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  return ["", "/about", "/services", "/work", "/process", "/contact", "/privacy", "/terms", ...c.services.map(s => `/services/${s.slug}`), ...c.projects.map(p => `/work/${p.slug}`)].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : .7 }));
}
