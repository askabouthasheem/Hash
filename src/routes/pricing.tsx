import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle, ArrowRight, Sparkle, XCircle } from "@phosphor-icons/react";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Hash · Live clip pipeline for creators" },
      { name: "description", content: "Simple plans for solo streamers, growing creators and full mod teams. Start free — no card required." },
      { property: "og:title", content: "Hash Pricing" },
      { property: "og:description", content: "From $0 to Studio — pay for the clips that pop." },
    ],
  }),
});

const plans = [
  {
    name: "Starter",
    tag: "Just seeing what this is",
    monthly: 0,
    yearly: 0,
    features: [
      ["30 clips / month", true],
      ["1 stream deck", true],
      ["720p exports", true],
      ["Auto captions · EN only", true],
      ["Watermark on posts", true],
      ["AI moment detection", false],
      ["Chat-triggered !clip bot", false],
    ] as [string, boolean][],
    cta: "Start free",
  },
  {
    name: "Creator",
    tag: "Most popular",
    monthly: 19,
    yearly: 15,
    highlight: true,
    features: [
      ["500 clips / month", true],
      ["3 stream decks", true],
      ["1080p60 · no watermark", true],
      ["Captions · 12 languages", true],
      ["Brand caption presets", true],
      ["AI moment detection", true],
      ["Chat-triggered !clip bot", false],
    ] as [string, boolean][],
    cta: "Go Creator",
  },
  {
    name: "Studio",
    tag: "For mod teams & agencies",
    monthly: 59,
    yearly: 47,
    features: [
      ["Unlimited clips", true],
      ["6 decks · 5 seats included", true],
      ["4K · priority render lane", true],
      ["180s rolling buffer", true],
      ["Chat-triggered !clip bot", true],
      ["AI moment detection", true],
      ["Whitelist & creator approval", true],
    ] as [string, boolean][],
    cta: "Go Studio",
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden pb-24 pt-16 lg:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "var(--grad-glow)" }} />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="chip"><Sparkle weight="fill" size={12} className="text-primary" /> Pricing</span>
          <h1 className="font-display mt-6 text-balance text-6xl leading-[1] md:text-7xl">
            Simple pricing.<br/>
            <em className="italic text-primary">Serious clip volume.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Every plan includes the Live Snatch tool, auto-vertical reframing and
            direct posting to TikTok, Shorts and Reels. Cancel any time.
          </p>

          <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-2 text-sm ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Yearly <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${yearly ? "bg-primary-foreground/20" : "bg-primary/20 text-primary"}`}>−20%</span>
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-6xl gap-4 px-5 lg:grid-cols-3 lg:px-8">
          {plans.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col gap-6 rounded-3xl border p-8 ${
                  p.highlight
                    ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent"
                    : "border-border bg-surface"
                }`}
                style={{ boxShadow: p.highlight ? "var(--shadow-glow)" : "var(--shadow-card)" }}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground">
                    {p.tag}
                  </span>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{p.name}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-6xl">${price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  {!p.highlight && <p className="mt-1 text-xs text-muted-foreground">{p.tag}</p>}
                  {yearly && price > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">Billed ${price * 12} yearly</p>
                  )}
                </div>
                <ul className="space-y-3">
                  {p.features.map(([label, included]) => (
                    <li key={label} className={`flex items-start gap-2 text-sm ${included ? "" : "text-muted-foreground/60"}`}>
                      {included ? (
                        <CheckCircle weight="fill" size={16} className="mt-0.5 text-primary shrink-0" />
                      ) : (
                        <XCircle weight="regular" size={16} className="mt-0.5 shrink-0" />
                      )}
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={p.highlight ? "btn-primary mt-auto" : "btn-ghost mt-auto"}>
                  {p.cta} <ArrowRight weight="bold" size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl px-5 text-center lg:px-8">
          <p className="text-sm text-muted-foreground">
            Running an agency or need &gt;50 seats? <a href="#" className="text-foreground underline underline-offset-4">Talk to us about Enterprise</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
