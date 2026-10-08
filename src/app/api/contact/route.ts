import { inquirySchema } from "@/lib/validations";
import { emailConfigured, sendInquiry } from "@/lib/email";
import { clientKey, rateLimit, sameOrigin } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Please submit from the VisionHelm website." }, { status: 403 });
  if (!rateLimit(`contact:${clientKey(request)}`, 5, 15 * 60 * 1000)) return Response.json({ error: "Too many attempts. Please try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
  if (Number(request.headers.get("content-length")) > 20000) return Response.json({ error: "Your inquiry is too long." }, { status: 413 });
  try {
    const raw = await request.text();
    if (raw.length > 20000) return Response.json({ error: "Your inquiry is too long." }, { status: 413 });
    const parsed = inquirySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return Response.json({ error: "Please check your inquiry details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (parsed.data.companyFax) return Response.json({ error: "Unable to accept this inquiry." }, { status: 400 });
    if (!emailConfigured()) return Response.json({ error: "Online inquiries are not connected yet. Please use the contact email when available." }, { status: 503 });
    await sendInquiry(parsed.data);
    return Response.json({ message: "Your inquiry has been sent. Thank you for sharing your vision." });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid inquiry format." }, { status: 400 });
    return Response.json({ error: "We couldn’t send your inquiry. Your details are still here; please try again later." }, { status: 502 });
  }
}
