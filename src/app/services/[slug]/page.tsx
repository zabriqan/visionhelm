import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, Label, PageHero, ProcessGrid, ProjectCard } from "@/components/ui";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = await getContent(); const s = c.services.find(s => s.slug === slug);
  return s ? pageMetadata(s.title, s.summary, `/services/${slug}`) : {};
}
export default async function Service({ params }: Props) {
  const { slug } = await params; const c = await getContent(); const s = c.services.find(s => s.slug === slug);
  if (!s) notFound();
  const related = c.projects.filter(p => p.services.some(service => s.deliverables.some(d => d.toLowerCase().includes(service.toLowerCase())))).slice(0, 2);
  return <><PageHero label="SERVICE / CAPABILITY" title={s.title} description={s.summary} /><section className="editorial-section container" data-reveal><Label>THE OPPORTUNITY</Label><div><h2>A solution shaped around your business.</h2><p>{s.problem}</p></div></section><section className="editorial-section container" data-reveal><div><Label>WHAT WE BRING</Label><h2 style={{ marginTop: 25 }}>Considered.<br />Connected.<br />Purposeful.</h2></div><ul className="deliverables">{s.deliverables.map((d, i) => <li key={i}><span>0{i + 1}</span>{d}</li>)}</ul></section><section className="process-section"><div className="container"><Label>HOW WE GET THERE</Label><h2 style={{ marginTop: 25 }}>{c.process.heading}</h2><ProcessGrid content={c.process} /></div></section>{related.length > 0 && <section className="work-section container"><Label>RELATED EXPLORATIONS</Label><div className="projects-grid" style={{ marginTop: 30 }}>{related.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}</div></section>}<section className="faq-section container"><Label>A LITTLE MORE CLARITY</Label><h2 style={{ marginTop: 25 }}>Your questions, considered.</h2>{s.faqs.map((f, i) => <details key={i}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</section><Closing content={c} /></>;
}
