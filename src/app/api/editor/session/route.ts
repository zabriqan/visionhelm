import { cookies } from "next/headers";
import { clientKey, makeSession, passwordsEqual, rateLimit, sameOrigin } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!rateLimit(`login:${clientKey(request)}`, 10, 15 * 60 * 1000)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const configured = process.env.EDITOR_PASSWORD;
  if (!configured || configured.length < 20) return Response.json({ error: "Set EDITOR_PASSWORD to at least 20 characters before using the editor." }, { status: 503 });
  try {
    const raw = await request.text();
    if (raw.length > 1000) return Response.json({ error: "Invalid password." }, { status: 400 });
    const { password } = JSON.parse(raw);
    if (typeof password !== "string" || !passwordsEqual(password, configured)) return Response.json({ error: "That password isn’t correct." }, { status: 401 });
    (await cookies()).set("visionhelm_editor", makeSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 });
    return Response.json({ success: true });
  } catch { return Response.json({ error: "Invalid sign-in request." }, { status: 400 }); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  (await cookies()).delete("visionhelm_editor");
  return Response.json({ success: true });
}
