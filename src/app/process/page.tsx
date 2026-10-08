import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Closing, PageHero, ProcessGrid } from "@/components/ui";
export const metadata = pageMetadata("Our Process", "A collaborative path from discovery to launch and beyond. How VisionHelm turns a shared vision into a connected digital experience.", "/process");
export default async function Process() {
  const c = await getContent();
  return <><PageHero label="HOW WE WORK" title={c.process.heading} description={c.process.description} /><section className="process-page container"><ProcessGrid content={c.process} expanded /></section><section className="process-section"><div className="container process-note" data-reveal><h2>A shared direction, from the very beginning.</h2><p>We agree on the scope, the decisions to make, and the way we’ll communicate before work begins. You stay close to the process, with space to ask questions, share feedback, and shape what comes next.</p><p>Every engagement is different. We recommend a timeline and approach after understanding the work, the people involved, and the outcome you’re working toward.</p></div></section><Closing content={c} /></>;
}
