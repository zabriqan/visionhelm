"use client";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { flushSync } from "react-dom";
import { contentSchema, type SiteContent } from "@/lib/content-schema";

type Tool = { name: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown };
type Context = { registerTool: (tool: Tool, options: { signal: AbortSignal }) => void | Promise<void> };
export function useEditorTools(content: SiteContent, setContent: Dispatch<SetStateAction<SiteContent>>, setNotice: Dispatch<SetStateAction<string>>, setIsError: Dispatch<SetStateAction<boolean>>) {
  const current = useRef(content);
  useEffect(() => { current.current = content; }, [content]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: "get_website_draft",
        description: "Read the signed-in editor’s current content draft, including unsaved changes. Does not change or save the website.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute: () => ({ content: structuredClone(current.current) }),
      },
      {
        name: "stage_website_content",
        description: "Stage complete website content in the signed-in editor for visible review and live preview. Read get_website_draft first and preserve its structure. This does not save or publish; the user must choose Save changes.",
        inputSchema: { type: "object", properties: { content: { type: "object", description: "Complete website content with the same structure as get_website_draft." } }, required: ["content"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: input => {
          const parsed = contentSchema.safeParse((input as { content?: unknown })?.content);
          if (!parsed.success) return { success: false, error: "Invalid content structure. Draft unchanged.", details: parsed.error.issues.slice(0, 3).map(issue => `${issue.path.join(".")}: ${issue.message}`) };
          flushSync(() => { setContent(parsed.data); setIsError(false); setNotice("Changes staged for review. Preview and save when you’re ready."); });
          current.current = parsed.data;
          return { success: true, state: "draft", saved: false };
        },
      },
    ];
    for (const tool of tools) {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
      catch { /* Optional browser capability; the visible editor remains available. */ }
    }
    return () => lifecycle.abort();
  }, [setContent, setNotice, setIsError]);
}
