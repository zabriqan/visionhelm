import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import type { CSSProperties } from "react";
import "./globals.css";
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const dynamic = "force-dynamic";
export const viewport: Viewport = { colorScheme: "light", themeColor: "#171B1A" };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "VisionHelm — Your Vision. Our Direction.", template: "%s | VisionHelm" },
  description: "Independent creative and technology studio. Brand strategy, distinctive identities, custom websites, and connected digital experiences for ambitious businesses.",
  alternates: { canonical: "/" },
  openGraph: { siteName: "VisionHelm", locale: "en_US", type: "website" },
  twitter: { card: "summary" },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const variables = Object.fromEntries(Object.entries(content.theme).map(([key, value]) => [`--${key}`, value])) as CSSProperties;
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: content.brand.name, url: siteUrl, description: metadata.description, ...(content.brand.email ? { email: content.brand.email } : {}), sameAs: [content.brand.instagram, content.brand.linkedin].filter(Boolean) };
  return <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable}`} style={variables}><body><a href="#main" className="skip-link">Skip to content</a><Navigation brandName={content.brand.name} /><main id="main">{children}</main><Footer content={content} /><Motion /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} /></body></html>;
}
