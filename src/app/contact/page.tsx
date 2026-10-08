import { getContent } from "@/lib/content";
import { emailConfigured } from "@/lib/email";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata("Start a Conversation", "Tell us what you’re building. Start a conversation about your next brand, website, or digital experience.", "/contact");
export default async function Contact() {
  const c = await getContent();
  return <><PageHero label="A NEW DIRECTION STARTS HERE" title="Tell us what you’re building." description="An idea, a challenge, or a new chapter. We’d love to hear what you have in mind." /><section className="contact-layout container"><aside className="contact-aside"><h2>Good things start with a conversation.</h2><p>Share a little about your business and where you want to go. We’ll take it from there.</p>{c.brand.email && <a href={`mailto:${c.brand.email}`}>{c.brand.email}</a>}<p className="contact-note">No need to have every detail figured out. An honest starting point is enough.</p></aside><ContactForm services={c.services.map(s => s.title)} configured={emailConfigured()} contactEmail={c.brand.email} /></section></>;
}
