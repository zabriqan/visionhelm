import Link from "next/link";
export default function NotFound() {
  return <section className="not-found container"><p className="eyebrow">A SMALL DETOUR</p><h1>Lost direction?</h1><p>This page may have moved, or the path isn’t quite right.</p><Link href="/" className="button button-dark">Back to the studio</Link></section>;
}
