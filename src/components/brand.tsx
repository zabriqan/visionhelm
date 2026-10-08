export function Brand({ compact = false, name = "VisionHelm" }: { compact?: boolean; name?: string }) {
  return <span className="brand"><svg viewBox="0 0 80 88" aria-hidden="true"><path d="M40 4 75 76 51 64 40 82 29 64 5 76Z M40 5V81M8 73 29 60 40 79 51 60 72 73" fill="none" stroke="currentColor" strokeWidth="3.5" /></svg>{!compact && (name === "VisionHelm" ? <span>Vision<span className="brand-gold">Helm</span></span> : <span>{name}</span>)}</span>;
}
export function BrandWatermark() {
  return <svg className="brand-watermark" viewBox="0 0 80 88" aria-hidden="true"><path d="M40 4 75 76 51 64 40 82 29 64 5 76Z M40 5V81M8 73 29 60 40 79 51 60 72 73" fill="none" stroke="currentColor" strokeWidth=".35" /></svg>;
}
