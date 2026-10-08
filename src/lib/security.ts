import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const attempts = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  // Bounded, per-instance protection. Use a distributed provider for large deployments.
  if (attempts.size > 5000) for (const [k, v] of attempts) if (v.reset < now) attempts.delete(k);
  if (attempts.size > 10000) return false;
  const item = attempts.get(key);
  if (!item || item.reset < now) { attempts.set(key, { count: 1, reset: now + windowMs }); return true; }
  item.count++; return item.count <= max;
}
export function clientKey(request: Request) { return createHash("sha256").update(request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local").digest("hex").slice(0, 24); }
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = [new URL(request.url).origin];
  if (process.env.NODE_ENV === "development") allowed.push("http://127.0.0.1:3000", "http://localhost:3000");
  if (process.env.NEXT_PUBLIC_SITE_URL) allowed.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
  return allowed.includes(origin);
}
export function passwordsEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
export function makeSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  const signature = createHmac("sha256", process.env.EDITOR_PASSWORD!).update(expires).digest("hex");
  return `${expires}.${signature}`;
}
export async function editorAuthorized() {
  const password = process.env.EDITOR_PASSWORD;
  if (!password || password.length < 20) return false;
  const token = (await cookies()).get("visionhelm_editor")?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  const expected = createHmac("sha256", password).update(expires).digest("hex");
  return passwordsEqual(signature, expected);
}
