"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="not-found container"><p className="eyebrow">A MOMENTARY PAUSE</p><h1>Let’s try again.</h1><p>Something interrupted this page. Please refresh or try again in a moment.</p><button className="button button-dark" onClick={reset}>Try again</button></section>;
}
