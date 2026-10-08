import { getContent } from "@/lib/content";
import { HomeView } from "@/components/home-view";
export default async function Home() { return <HomeView c={await getContent()} />; }
