"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function Motion() {
  const path = usePathname();
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const image = main.querySelector(".hero-image");
        const hero = main.querySelectorAll(".hero-reveal");
        if (image) gsap.from(image, { scale: 1.035, duration: 1.4, ease: "power2.out", clearProps: "transform" });
        if (hero.length) gsap.from(hero, { y: 18, duration: .85, stagger: .08, ease: "power2.out", clearProps: "transform" });
        // Motion enhances visible content; no section relies on a trigger to become readable.
        main.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => gsap.from(el, { y: 20, immediateRender: false, duration: .7, ease: "power2.out", clearProps: "transform", scrollTrigger: { trigger: el, start: "top 94%", once: true } }));
        main.querySelectorAll<HTMLElement>(".process-line").forEach(line => gsap.from(line, { scaleX: .5, transformOrigin: "left", immediateRender: false, duration: 1.1, clearProps: "transform", scrollTrigger: { trigger: line.parentElement, start: "top 90%", once: true } }));
      }, main);
      return () => ctx.revert();
    });
    let active = true;
    void document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; mm.revert(); };
  }, [path]);
  return null;
}
