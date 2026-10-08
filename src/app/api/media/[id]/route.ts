import { readMedia } from "@/lib/media";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}\.jpg$/.test(id)) return new Response("Not found", { status: 404 });
  try {
    const data = await readMedia(id);
    if (!data) return new Response("Not found", { status: 404 });
    return new Response(data as BodyInit, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response("Image temporarily unavailable", { status: 503 }); }
}
