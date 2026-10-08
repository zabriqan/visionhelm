"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
const links = [["Work", "/work"], ["Services", "/services"], ["About", "/about"], ["Process", "/process"]];
export function Navigation({ brandName = "VisionHelm" }: { brandName?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [path]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function keys(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
      if (event.key === "Tab") {
        const focusable = [trigger.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a") || [])].filter(Boolean) as HTMLElement[];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", keys);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", keys); };
  }, [open]);
  return <header className={`navigation ${scrolled || path !== "/" ? "navigation-solid" : ""} ${open ? "menu-is-open" : ""}`}>
    <nav className="nav-inner" aria-label="Main navigation">
      <Link href="/" aria-label={`${brandName} home`} onClick={() => setOpen(false)}><Brand name={brandName} /></Link>
      <div className="desktop-links">{links.map(([label, href]) => <Link key={href} href={href} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}</div>
      <Link href="/contact" className="button button-gold nav-cta">Start a Project</Link>
      <button ref={trigger} className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span>{open ? <X size={21} /> : <Menu size={21} />}</button>
    </nav>
    {open && <div ref={panel} id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation">
      <span className="eyebrow">FIND YOUR DIRECTION</span>
      {links.map(([label, href], i) => <Link key={href} href={href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}</Link>)}
      <Link href="/contact" className="button button-gold" onClick={() => setOpen(false)}>Start a Project</Link>
      <p className="eyebrow">YOUR VISION. OUR DIRECTION.</p>
    </div>}
  </header>;
}
