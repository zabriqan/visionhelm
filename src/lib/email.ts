import "server-only";
import type { Inquiry } from "./validations";
export function emailConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL);
}
export async function sendInquiry(inquiry: Inquiry) {
  if (!emailConfigured()) throw new Error("Contact delivery is not configured.");
  const text = ["New VisionHelm project inquiry", "", `Name: ${inquiry.name}`, `Work email: ${inquiry.email}`, `Company: ${inquiry.company}`, `Website: ${inquiry.website || "Not provided"}`, `Services: ${inquiry.services.join(", ")}`, `Budget: ${inquiry.budget || "Not provided"}`, `Timeframe: ${inquiry.timeframe || "Not provided"}`, "", inquiry.description].join("\n");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: inquiry.email, subject: "New VisionHelm project inquiry", text }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("Email delivery failed.");
  const data = await response.json();
  if (typeof data.id !== "string" || !data.id) throw new Error("Email provider did not confirm acceptance.");
}
