"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
export function EditorLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  return <section className="editor-login container"><LockKeyhole size={26} strokeWidth={1} /><p className="eyebrow">YOUR STUDIO, IN YOUR HANDS</p><h1>Make it yours.</h1><p>Edit your website’s content, images, projects, and colors.</p>{!configured && <p className="form-status">Set EDITOR_PASSWORD to at least 20 characters in your environment to enable the editor.</p>}<form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(""); const password = new FormData(e.currentTarget).get("password"); try { const res = await fetch("/api/editor/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); router.refresh(); } catch (error) { setError(error instanceof Error ? error.message : "Unable to sign in."); } finally { setBusy(false); } }}><div className="form-field"><label htmlFor="editor-password">Editor password</label><input id="editor-password" name="password" type="password" autoComplete="current-password" required /></div>{error && <p className="field-error" role="alert">{error}</p>}<button className="button button-dark" disabled={!configured || busy}>{busy ? "Signing in…" : "Open the Editor"}</button></form></section>;
}
