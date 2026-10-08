"use client";
import { useEffect, useState } from "react";
import { HomeView } from "./home-view";
import { contentSchema, type SiteContent } from "@/lib/content-schema";
export function PreviewCanvas({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "visionhelm-preview") return;
      const parsed = contentSchema.safeParse(event.data.content);
      if (parsed.success) setContent(parsed.data);
    }
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "visionhelm-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => { for (const [key, value] of Object.entries(content.theme)) document.documentElement.style.setProperty(`--${key}`, value); }, [content.theme]);
  return <HomeView c={content} />;
}
