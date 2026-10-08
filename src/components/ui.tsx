import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Project, SiteContent } from "@/lib/content-schema";
export function Label({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function TextLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) { return <Link href={href} className={`text-link ${light ? "light" : ""}`}>{children}<Plus size={15} aria-hidden="true" /></Link>; }
export function PageHero({ label, title, description }: { label: string; title: string; description?: string }) {
  return <section className="page-hero container"><Label>{label}</Label><h1 data-reveal>{title}</h1>{description && <p className="page-intro" data-reveal>{description}</p>}<div className="hero-rule"><span>YOUR VISION. OUR DIRECTION.</span><span>VISIONHELM STUDIO</span></div></section>;
}
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const websitePreview = project.visual === "image" && project.image.includes("-website.");
  const domain = project.url ? new URL(project.url).hostname.replace(/^www\./, "") : project.title;
  return <Link href={`/work/${project.slug}`} className={`project-card project-${index % 2} ${websitePreview ? "project-website-preview" : ""}`} data-reveal>
    <div className={`project-image ${project.visual === "typographic" ? "project-typographic" : ""}`}>{project.visual === "typographic" ? <div className="project-type-composition"><span className="eyebrow">VISIONHELM / SELECTED PROJECT</span><span className="project-type-name">{project.title}</span><span className="project-type-caption">YOUR VISION. OUR DIRECTION.</span></div> : websitePreview ? <div className="project-website"><div className="project-browser-bar" aria-hidden="true"><span className="browser-dots"><i /><i /><i /></span><span>{domain}</span></div><div className="project-website-screen"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 700px) 90vw, 45vw" /></div></div> : <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 700px) 100vw, 50vw" />}<span className="project-status">{project.status}</span><span className="project-open" aria-hidden="true"><Plus size={22} /></span>{project.slug === "forma-studio" && <span className="project-overlay-word">forma<span>SPACE FOR A NEW PERSPECTIVE</span></span>}</div>
    <div className="project-caption"><div><h3>{project.title}</h3><p>{project.industry}</p></div><span>{project.services.slice(0, 2).join(" / ")}</span></div>
  </Link>;
}
export function ProcessGrid({ content, expanded = false }: { content: SiteContent["process"]; expanded?: boolean }) {
  return <div className={`process-grid ${expanded ? "expanded" : ""}`}><div className="process-line" />{content.steps.map((step, i) => <article key={i} data-reveal><span className="step-number">0{i + 1}</span><div className="step-dot" /><h3>{step.title}</h3><p>{step.description}</p>{expanded && <p className="step-detail">{step.detail}</p>}</article>)}</div>;
}
export function Closing({ content }: { content: SiteContent }) {
  return <section className="closing container" data-reveal><Label>A SHARED AMBITION. A NEW DIRECTION.</Label><h2>{content.closing.heading}</h2><div className="closing-bottom"><p>{content.closing.description}</p><Link className="button button-dark" href="/contact">{content.closing.cta}</Link></div>{content.brand.email && <a className="closing-email" href={`mailto:${content.brand.email}`}>{content.brand.email}</a>}</section>;
}
