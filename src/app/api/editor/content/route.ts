import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/content";
import { contentSchema } from "@/lib/content-schema";
import { editorAuthorized, sameOrigin } from "@/lib/security";
const revision = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export async function GET() {
  if (!await editorAuthorized()) return Response.json({ error: "Please sign in to the editor." }, { status: 401 });
  const content = await getContent();
  return Response.json({ content, revision: revision(content) }, { headers: { "Cache-Control": "private, no-store" } });
}
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!await editorAuthorized()) return Response.json({ error: "Your session has expired. Sign in again; export a backup first to keep your changes." }, { status: 401 });
  try {
    const raw = await request.text();
    if (raw.length > 500000) return Response.json({ error: "Content exceeds the 500 KB limit." }, { status: 413 });
    const parsed = contentSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return Response.json({ error: parsed.error.issues.slice(0, 4).map(i => `${i.path.join(" → ")}: ${i.message}`).join("\n") }, { status: 400 });
    const current = await getContent();
    if (request.headers.get("if-match") !== revision(current)) return Response.json({ error: "Content changed in another session. Export your draft, then reload to review the latest version." }, { status: 409 });
    await saveContent(parsed.data);
    revalidatePath("/", "layout");
    return Response.json({ success: true, revision: revision(parsed.data) });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "This is not valid JSON." }, { status: 400 });
    return Response.json({ error: "Could not save your changes. Check the storage configuration; your draft is still here." }, { status: 503 });
  }
}
