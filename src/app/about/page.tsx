import Image from "next/image";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, Label, PageHero } from "@/components/ui";
import { BrandWatermark } from "@/components/brand";
export const metadata = pageMetadata("About the Studio", "A partner in your journey. Discover the philosophy, principles, and purpose behind VisionHelm.", "/about");
export default async function About() {
  const c = await getContent();
  return <>
    <PageHero label="ABOUT VISIONHELM" title={c.about.heading} description={c.about.intro} />
    <section className="about-composition container" aria-labelledby="about-belief-heading" data-reveal>
      <div className="about-landscape">
        <Image src={c.about.image} alt={c.about.imageAlt} fill loading="eager" sizes="(max-width:800px) 94vw, 76vw" />
        <span className="about-image-note">{c.brand.tagline}</span>
      </div>
      <div className="about-belief">
        <BrandWatermark />
        <Label>OUR BELIEF</Label>
        <h2 id="about-belief-heading">{c.about.beliefHeading}</h2>
        <p>{c.about.belief}</p>
      </div>
      <p className="about-composition-caption">{c.brand.name} / Strategy, design &amp; technology</p>
    </section>
    <section className="mission-grid container" data-reveal><div><Label>OUR MISSION</Label><h2>Give vision a foundation.</h2><p>{c.about.mission}</p></div><div><Label>OUR VISION</Label><h2>A partner for what comes next.</h2><p>{c.about.vision}</p></div></section>
    <section className="principles-section"><div className="editorial-section container" data-reveal><div><Label>WHAT GUIDES US</Label><h2 style={{ marginTop: 25 }}>Our principles.</h2></div><div>{c.about.principles.map((p, i) => <div className="principle" key={i}><span>0{i + 1}</span><h3>{p}</h3></div>)}</div></div></section>
    <section className="editorial-section container" data-reveal><Label>THE STUDIO</Label><div><h2>Different disciplines.<br />One shared direction.</h2><p>{c.about.studio}</p></div></section>
    {c.about.team.length > 0 && <section className="team-grid container">{c.about.team.map(person => <article key={person.name}><div className="team-portrait"><Image src={person.image} alt={person.name} fill sizes="(max-width:540px) 100vw, 33vw" /></div><h3>{person.name}</h3><p>{person.role}</p><p>{person.bio}</p></article>)}</section>}
    <Closing content={c} />
  </>;
}
