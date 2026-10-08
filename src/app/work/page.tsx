import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, PageHero, ProjectCard } from "@/components/ui";
export const metadata = pageMetadata("Selected Work", "Brand and digital explorations from the VisionHelm studio. A considered approach to ambitious ideas.", "/work");
export default async function Work() {
  const c = await getContent();
  return <><PageHero label="SELECTED WORK" title={c.work.heading} description={c.work.description} /><section className="work-page container"><p className="work-note">Selected client projects alongside clearly labeled studio explorations. Some engagements remain private; names and identifying details are shared only with permission.</p><div className="projects-grid">{c.projects.map((p, i) => <ProjectCard project={p} index={i} key={p.slug} />)}</div>{c.projects.length === 0 && <p>New work is taking shape. Start a conversation to explore what we could build together.</p>}</section><Closing content={c} /></>;
}
