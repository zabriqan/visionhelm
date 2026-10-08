import Link from "next/link";
import { Plus } from "lucide-react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, PageHero } from "@/components/ui";
export const metadata = pageMetadata("Services & Capabilities", "Brand strategy, web development, digital products, and ongoing growth. Everything your vision needs to move forward.", "/services");
export default async function Services() {
  const c = await getContent();
  return <><PageHero label="OUR CAPABILITIES" title="A connected approach to your next chapter." description="Strategy, creativity, and technology. Brought together around the needs of your business." /><section className="service-list container">{c.services.map((s, i) => <Link href={`/services/${s.slug}`} className="service-row" key={s.slug} data-reveal><span>0{i + 1}</span><h2>{s.title}</h2><div><p>{s.summary}</p><span className="service-tags">{s.deliverables.slice(0, 4).join(" / ")}</span></div><Plus size={24} strokeWidth={1} aria-hidden="true" /></Link>)}</section><Closing content={c} /></>;
}
