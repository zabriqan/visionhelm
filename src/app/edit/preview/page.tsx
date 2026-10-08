import { redirect } from "next/navigation";
import { editorAuthorized } from "@/lib/security";
import { getContent } from "@/lib/content";
import { PreviewCanvas } from "@/components/preview-canvas";
export const metadata = { title: "Draft Preview", robots: { index: false, follow: false } };
export default async function Preview() {
  if (!await editorAuthorized()) redirect("/edit");
  return <PreviewCanvas initial={await getContent()} />;
}
