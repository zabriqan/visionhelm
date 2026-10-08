"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type Inquiry } from "@/lib/validations";
export function ContactForm({ services, configured, contactEmail }: { services: string[]; configured: boolean; contactEmail: string }) {
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inquiry>({ resolver: zodResolver(inquirySchema), defaultValues: { services: [], budget: "", timeframe: "", website: "", companyFax: "" } });
  async function submit(data: Inquiry) {
    setStatus(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unable to send your inquiry.");
      setStatus({ type: "success", message: result.message }); reset();
    } catch (error) { setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to send your inquiry. Please try again." }); }
  }
  function error(name: keyof Inquiry) { return errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]?.message}</p> : null; }
  return <form onSubmit={handleSubmit(submit)} noValidate><div className="form-grid">
    {!configured && <div className="form-full form-status" role="status">{contactEmail ? <>Start a conversation by emailing <a href={`mailto:${contactEmail}`} className="contact-direct-email">{contactEmail}</a>. Online form submissions will be available soon.</> : <>Online inquiries are not connected yet. You can explore the form; sending will be available once email delivery is configured.</>}</div>}
    <div className="form-field"><label htmlFor="name">Full name *</label><input id="name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{error("name")}</div>
    <div className="form-field"><label htmlFor="email">Work email *</label><input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{error("email")}</div>
    <div className="form-field"><label htmlFor="company">Company / brand name *</label><input id="company" autoComplete="organization" {...register("company")} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />{error("company")}</div>
    <div className="form-field"><label htmlFor="website">Website URL <span>(optional)</span></label><input id="website" type="url" placeholder="https://" autoComplete="url" {...register("website")} aria-invalid={!!errors.website} aria-describedby={errors.website ? "website-error" : undefined} />{error("website")}</div>
    <fieldset className="form-field form-fieldset form-full"><legend>What can we help with? *</legend><div className="service-checkboxes">{services.map(s => <label key={s}><input type="checkbox" value={s} {...register("services")} aria-describedby={errors.services ? "services-error" : undefined} />{s}</label>)}</div>{error("services")}</fieldset>
    <div className="form-field"><label htmlFor="budget">Approximate budget <span>(optional)</span></label><select id="budget" {...register("budget")}><option value="">Select a range</option>{["Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000–$25,000", "$25,000+", "Not sure yet"].map(v => <option key={v}>{v}</option>)}</select></div>
    <div className="form-field"><label htmlFor="timeframe">Preferred start <span>(optional)</span></label><select id="timeframe" {...register("timeframe")}><option value="">Select a timeframe</option>{["As soon as possible", "1–3 months", "3–6 months", "Just exploring"].map(v => <option key={v}>{v}</option>)}</select></div>
    <div className="form-field form-full"><label htmlFor="description">Tell us about your project *</label><textarea id="description" rows={6} placeholder="Your vision, your ambitions, and what you’d like to achieve…" {...register("description")} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} />{error("description")}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="companyFax">Company fax</label><input id="companyFax" tabIndex={-1} autoComplete="off" {...register("companyFax")} /></div>
    <p className="form-disclaimer form-full">By submitting, you agree that we may use these details to respond to your inquiry. Read our <Link href="/privacy">privacy policy</Link>.</p>
    {status && <div className={`form-status form-full ${status.type}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</div>}
    <div className="form-full"><button type="submit" className="button button-dark" disabled={!configured || isSubmitting}>{isSubmitting ? "Sending your inquiry…" : "Send Your Inquiry"}</button></div>
  </div></form>;
}
