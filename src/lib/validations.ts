import { z } from "zod";
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid work email.").max(254),
  company: z.string().trim().min(1, "Please enter your company or brand name.").max(160),
  website: z.union([z.literal(""), z.url("Please include https:// in your website address.").refine(v => /^https?:\/\//.test(v), "Use an http or https address.")]).optional(),
  services: z.array(z.string().max(120)).min(1, "Choose at least one service.").max(10),
  budget: z.enum(["", "Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000–$25,000", "$25,000+", "Not sure yet"]).optional(),
  timeframe: z.enum(["", "As soon as possible", "1–3 months", "3–6 months", "Just exploring"]).optional(),
  description: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(8000, "Please keep your description under 8,000 characters."),
  companyFax: z.string().max(200).optional(),
});
export type Inquiry = z.infer<typeof inquirySchema>;
