import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, Label, PageHero, TextLink } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.projects.find(p => p.slug === slug);
  return p ? pageMetadata(p.title, p.summary, `/work/${slug}`) : {};
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const index = c.projects.findIndex(p => p.slug === slug);
  const p = c.projects[index];
  if (!p) notFound();
  const next = c.projects[(index + 1) % c.projects.length];
  const sections = [["01 / THE CHALLENGE", p.challenge], ["02 / OUR APPROACH", p.approach], ["03 / THE SOLUTION", p.solution]].filter(([, text]) => text);
  return <>
    <PageHero label={`${p.status.toUpperCase()} / ${p.industry.toUpperCase()}`} title={p.title} description={p.summary} />
    {p.visual === "typographic" ? <div className="case-image project-typographic"><div className="project-type-composition container"><span className="eyebrow">VISIONHELM / SELECTED PROJECT</span><span className="project-type-name">{p.title}</span><span className="project-type-caption">YOUR VISION. OUR DIRECTION.</span></div></div> : <div className="case-image"><Image src={p.image} alt={p.imageAlt} fill preload sizes="100vw" /></div>}
    <section className="case-meta container"><div><Label>PROJECT TYPE</Label><p>{p.status}</p></div><div><Label>FOCUS</Label><p>{p.industry}</p></div>{p.services.length > 0 && <div><Label>SCOPE</Label><p>{p.services.join(" / ")}</p></div>}{p.year && <div><Label>YEAR</Label><p>{p.year}</p></div>}</section>
    {p.status !== "Client Project" && <div className="container"><p className="work-note" style={{ marginTop: 25 }}>A studio exploration. This is illustrative work, with no commissioned client or claimed business outcomes.</p></div>}
    {sections.map(([label, text]) => <section className="editorial-section container" data-reveal key={label}><Label>{label}</Label><div><h2>{text}</h2></div></section>)}
    {p.gallery.length > 0 && <section className="case-gallery container">{p.gallery.map((img, i) => <div key={i}><Image src={img.src} alt={img.alt} fill sizes="(max-width:540px) 100vw, 50vw" /></div>)}</section>}
    {p.outcomes.length > 0 && p.status === "Client Project" && <section className="editorial-section container"><Label>VERIFIED OUTCOMES</Label><ul className="deliverables">{p.outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul></section>}
    {(p.technologies.length > 0 || p.url) && <section className="editorial-section container"><Label>THE DETAILS</Label><div>{p.technologies.length > 0 && <p style={{ marginTop: 0 }}>{p.technologies.join(" / ")}</p>}{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-link">Visit the website</a>}</div></section>}
    {next && next.slug !== p.slug && <section className="next-project container"><div><Label>NEXT PROJECT</Label><Link href={`/work/${next.slug}`}><h2>{next.title}</h2></Link></div><TextLink href={`/work/${next.slug}`}>View project</TextLink></section>}
    <Closing content={c} />
  </>;
}
