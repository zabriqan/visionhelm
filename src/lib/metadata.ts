import type { Metadata } from "next";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | VisionHelm`, description, url: path, type: "website" }, twitter: { card: "summary", title: `${title} | VisionHelm`, description } };
}
