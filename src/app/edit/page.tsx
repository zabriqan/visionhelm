import { createHash } from "node:crypto";
import { getContent, storageAvailable } from "@/lib/content";
import { editorAuthorized } from "@/lib/security";
import { Editor } from "@/components/editor";
import { EditorLogin } from "@/components/editor-login";
import "./editor.css";
export const metadata = { title: "Website Editor", robots: { index: false, follow: false } };
export default async function Edit() {
  if (!await editorAuthorized()) return <EditorLogin configured={!!process.env.EDITOR_PASSWORD && process.env.EDITOR_PASSWORD.length >= 20} />;
  const content = await getContent();
  return <Editor initial={content} initialRevision={createHash("sha256").update(JSON.stringify(content)).digest("hex")} storageReady={storageAvailable()} contactEmailManaged={!!process.env.CONTACT_TO_EMAIL?.trim()} />;
}
