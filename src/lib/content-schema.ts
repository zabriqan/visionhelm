import { z } from "zod";

const text = z.string().max(12000);
const short = z.string().min(1).max(250);
const imagePath = z.string().max(2000).refine(v => /^\/(?!\/)/.test(v) || /^https:\/\/images\.unsplash\.com\//.test(v), "Use a local /images path or an images.unsplash.com URL.");
const optionalUrl = z.union([z.literal(""), z.url().refine(v => v.startsWith("https://"), "Use an https URL.")]);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
export const contentSchema = z.object({
  brand: z.object({ name: short, tagline: text, email: z.union([z.literal(""), z.email()]), instagram: optionalUrl, linkedin: optionalUrl }),
  theme: z.object({ obsidian: z.string().regex(/^#[\da-fA-F]{6}$/), gold: z.string().regex(/^#[\da-fA-F]{6}$/), ivory: z.string().regex(/^#[\da-fA-F]{6}$/), sage: z.string().regex(/^#[\da-fA-F]{6}$/), stone: z.string().regex(/^#[\da-fA-F]{6}$/) }),
  hero: z.object({ eyebrow: text, heading: short, highlight: short, description: text, image: imagePath, imageAlt: short, primaryCta: short, secondaryCta: short }),
  intro: z.object({ eyebrow: text, heading: short, description: text, detail: text }),
  capabilities: z.object({ heading: short, items: z.array(z.object({ title: short, description: text, slug, tags: text })).min(1).max(12) }),
  work: z.object({ heading: short, description: text }),
  process: z.object({ heading: short, description: text, steps: z.array(z.object({ title: short, description: text, detail: text })).min(1).max(12) }),
  industries: z.object({ heading: short, description: text, items: z.array(short).min(1).max(20) }),
  partnership: z.object({ heading: short, description: text }),
  thinking: z.object({ heading: short, description: text, items: z.array(z.object({ title: short, description: text })).max(10) }),
  closing: z.object({ heading: short, description: text, cta: short }),
  about: z.object({ heading: short, intro: text, image: imagePath.default("/images/architecture.jpg"), imageAlt: short.default("Contemporary architecture overlooking a mountain valley at sunset"), beliefHeading: short.default("Understanding before execution. Purpose in every detail."), belief: text, mission: text, vision: text, studio: text, principles: z.array(short).max(20), team: z.array(z.object({ name: short, role: short, bio: text, image: imagePath })).max(30) }),
  services: z.array(z.object({ slug, title: short, shortTitle: short, summary: text, problem: text, deliverables: z.array(short).max(30), faqs: z.array(z.object({ question: short, answer: text })).max(20) })).min(1).max(30),
  projects: z.array(z.object({ slug, title: short, industry: short, year: z.string().max(4), status: z.enum(["Concept Project", "Internal Exploration", "Client Project"]), visual: z.enum(["image", "typographic"]).default("image"), client: text, services: z.array(short).max(30), summary: text, challenge: text, approach: text, solution: text, image: imagePath, imageAlt: short, gallery: z.array(z.object({ src: imagePath, alt: short })).max(20), technologies: z.array(short).max(30), outcomes: z.array(short).max(30), url: optionalUrl })).max(50),
  legal: z.object({ entity: text, jurisdiction: text, privacyContact: text, effectiveDate: text, privacyAdditional: text, termsAdditional: text }),
}).superRefine((data, ctx) => {
  for (const key of ["services", "projects"] as const) {
    const seen = new Set<string>();
    data[key].forEach((item, i) => {
      if (seen.has(item.slug)) ctx.addIssue({ code: "custom", message: "Slugs must be unique.", path: [key, i, "slug"] });
      seen.add(item.slug);
    });
  }
  data.capabilities.items.forEach((item, i) => {
    if (!data.services.some(s => s.slug === item.slug)) ctx.addIssue({ code: "custom", message: "Choose an existing service slug.", path: ["capabilities", "items", i, "slug"] });
  });
});
export type SiteContent = z.infer<typeof contentSchema>;
export type Project = SiteContent["projects"][number];
