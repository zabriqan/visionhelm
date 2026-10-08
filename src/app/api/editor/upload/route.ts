import sharp from "sharp";
import { editorAuthorized, sameOrigin, clientKey, rateLimit } from "@/lib/security";
import { storageAvailable } from "@/lib/content";
import { saveMedia } from "@/lib/media";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!await editorAuthorized()) return Response.json({ error: "Please sign in to upload images." }, { status: 401 });
  if (!rateLimit(`upload:${clientKey(request)}`, 30, 15 * 60 * 1000)) return Response.json({ error: "Please wait before uploading more images." }, { status: 429 });
  if (!storageAvailable()) return Response.json({ error: "Image storage is not configured." }, { status: 503 });
  if (Number(request.headers.get("content-length")) > 9 * 1024 * 1024) return Response.json({ error: "Choose an image under 8 MB." }, { status: 413 });
  try {
    const form = await request.formData(); const file = form.get("image");
    if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return Response.json({ error: "Choose a JPEG, PNG, or WebP image under 8 MB." }, { status: 400 });
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 }).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    const id = `${crypto.randomUUID()}.jpg`;
    await saveMedia(id, buffer);
    return Response.json({ url: `/api/media/${id}` });
  } catch { return Response.json({ error: "Could not process this image. Please try another JPEG, PNG, or WebP file." }, { status: 400 }); }
}
