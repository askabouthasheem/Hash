import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Lightning,
  Scissors,
  Broadcast,
  TiktokLogo,
  TwitchLogo,
  YoutubeLogo,
  Waveform,
  ClosedCaptioning,
  ArrowRight,
  ArrowUpRight,
  CircleNotch,
  Sparkle,
  Timer,
  Robot,
  Queue,
  ChatCircleText,
  CaretDown,
  CheckCircle,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { Reveal } from "../components/site/Reveal";
import { useSmoothScroll } from "../hooks/use-smooth-scroll";
import fortniteclip from "../assets/fortniteclip.mp4";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Hash — Clip livestreams the second they pop off" },
      {
        name: "description",
        content:
          "Hash is the live-clipping deck for creators. Snatch the last 60s of any Twitch, Kick or YouTube stream, auto-caption vertical, ship straight to TikTok.",
      },
    ],
  }),
});

function Landing() {
  useSmoothScroll();
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Header />
      <Hero />
      <LogoStrip />
      <SnatchDemo />
      <Workflow />
      <Features />
      <StatsBanner />
      <PricingPreview />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- SCROLL PROGRESS ---------------- */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop || window.scrollY) / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${p})`,
          background: "var(--grad-lime)",
          boxShadow: "0 0 18px oklch(0.9 0.19 122 / 0.6)",
          transition: "transform 0.15s linear",
        }}
      />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--grad-glow)" }}
      />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="chip">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live live-pulse" />
              LIVE SNATCH · v0.9
            </span>

            <h1 className="font-display mt-6 text-balance text-[clamp(3rem,7vw,6.75rem)] leading-[0.95] tracking-tight">
              Clip the moment <em className="italic text-primary">before</em> it
              trends.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Watch any Twitch, Kick or YouTube livestream inside Hash. When
              something wild happens, hit <kbd className="mx-1 rounded-md border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-xs">S</kbd>
              — we grab the last 60 seconds from the live buffer, cut it 9:16,
              burn animated captions, and post to TikTok while the streamer's
              still going.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn-primary h-12 px-6 text-[0.95rem]">
                Start snatching free
                <ArrowRight weight="bold" size={16} />
              </Link>
              <a href="#snatch" className="btn-ghost h-12 px-6 text-[0.95rem]">
                See it in action
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle weight="fill" size={14} className="text-primary" /> No card required</span>
              <span className="flex items-center gap-2"><CheckCircle weight="fill" size={14} className="text-primary" /> 30 free clips / month</span>
              <span className="flex items-center gap-2"><CheckCircle weight="fill" size={14} className="text-primary" /> Ship to TikTok, Shorts, Reels</span>
            </div>
          </div>

          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Deck header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-live live-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">LIVE · 24,881 watching</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">02:14:37</span>
        </div>

        {/* Fake stream */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <video
            src={fortniteclip}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, oklch(0 0 0 / 0.35) 0%, transparent 30%, transparent 55%, oklch(0 0 0 / 0.75) 100%)",
            }}
          />
          <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

          {/* Streamer chip */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground font-display text-sm">v</span>
            <span className="text-xs font-medium">vexy_live</span>
            <span className="chip !py-0.5 !text-[10px]">FPS · Ranked</span>
          </div>


          {/* Snatch button */}
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
              <Waveform size={14} className="text-primary" />
              <span className="font-mono text-[11px] text-muted-foreground">-00:60 → NOW</span>
            </div>
            <button className="btn-primary h-10 px-5">
              <Scissors weight="bold" size={16} />
              Snatch clip · S
            </button>
          </div>
        </div>

        {/* Deck footer: recent clip */}
        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <TiktokLogo weight="fill" size={18} />
            </div>
            <div>
              <p className="text-sm font-medium leading-tight">Posted to @vexyclips</p>
              <p className="font-mono text-[11px] text-muted-foreground">clip_2814 · 9:16 · captions on · 12s ago</p>
            </div>
          </div>
          <span className="chip text-primary">Live</span>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -left-6 top-16 hidden rounded-2xl border border-border-strong bg-surface p-3 shadow-xl md:block" style={{ animation: "floatY 6s ease-in-out infinite" }}>
        <div className="flex items-center gap-2 text-xs">
          <Lightning weight="fill" size={14} className="text-primary" />
          <span className="font-medium">Clip ready in 4.2s</span>
        </div>
      </div>
      <div className="absolute -right-4 bottom-24 hidden rounded-2xl border border-border-strong bg-surface p-3 shadow-xl md:block" style={{ animation: "floatY 7s ease-in-out infinite reverse" }}>
        <div className="flex items-center gap-2 text-xs">
          <ClosedCaptioning weight="fill" size={14} className="text-primary" />
          <span className="font-medium">Captions burned · EN → 12 langs</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- LOGO STRIP ---------------- */
function LogoStrip() {
  const items = [
    { Icon: TwitchLogo, name: "Twitch" },
    { Icon: YoutubeLogo, name: "YouTube Live" },
    { Icon: Broadcast, name: "Kick" },
    { Icon: TiktokLogo, name: "TikTok" },
    { Icon: Broadcast, name: "Instagram Live" },
    { Icon: YoutubeLogo, name: "Shorts" },
  ];
  return (
    <section className="border-y border-border bg-surface/30 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Sources · Destinations
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="marquee-track flex w-max gap-14">
            {[...items, ...items, ...items].map(({ Icon, name }, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <Icon size={22} />
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SNATCH DEMO ---------------- */
function SnatchDemo() {
  return (
    <section id="snatch" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionEyebrow>The Live Snatch tool</SectionEyebrow>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="font-display text-balance text-5xl leading-[1] md:text-6xl">
            One hotkey. Sixty seconds of rewind.<br/>
            <span className="italic text-muted-foreground">Zero editor open.</span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            Every livestream you open in Hash gets a rolling 60-second buffer on
            our edge. Hit snatch, we rewind and process. You keep watching.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <DemoCard
            delay={0}
            step="01"
            icon={<Broadcast weight="duotone" size={22} />}
            title="Watch the stream"
            body="Paste any Twitch, Kick or YouTube URL. We start buffering the low-latency feed the moment it loads."
            visual={
              <div className="relative h-40 overflow-hidden rounded-xl border border-border" style={{background: "linear-gradient(140deg, oklch(0.25 0.06 280), oklch(0.16 0.02 260))"}}>
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-live" />
                  <span className="font-mono text-[10px] text-muted-foreground">LIVE 1080p60</span>
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">-60s</span>
                </div>
              </div>
            }
          />
          <DemoCard
            delay={120}
            step="02"
            icon={<Scissors weight="duotone" size={22} />}
            title="Snatch the moment"
            body="Hit S or the big green button. We freeze the rolling buffer and hand the last 60s off to the render farm."
            highlight
            visual={
              <div className="relative flex h-40 items-center justify-center rounded-xl border border-primary/40 bg-primary/5">
                <button className="btn-primary h-14 px-8 text-base">
                  <Scissors weight="bold" size={18} /> Snatch
                </button>
                <span className="absolute right-3 top-3 font-mono text-[10px] text-primary">READY</span>
              </div>
            }
          />
          <DemoCard
            delay={240}
            step="03"
            icon={<TiktokLogo weight="duotone" size={22} />}
            title="Auto-ship to TikTok"
            body="9:16 reframe, captions burned in your brand font, first frame chosen. Posted to your account with a title."
            visual={
              <div className="relative flex h-40 items-center justify-center gap-3 rounded-xl border border-border bg-surface-2">
                {[0,1,2].map((i) => (
                  <div key={i} className="h-32 w-16 rounded-lg border border-border" style={{
                    background: "linear-gradient(180deg, oklch(0.3 0.08 260), oklch(0.18 0.02 260))",
                    transform: `translateY(${i===1?-6:0}px)`
                  }}>
                    <div className="mx-auto mt-24 h-2 w-10 rounded-full bg-primary/70" />
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

function DemoCard({ step, icon, title, body, visual, highlight, delay = 0 }: {
  step: string; icon: React.ReactNode; title: string; body: string; visual: React.ReactNode; highlight?: boolean; delay?: number;
}) {
  return (
    <Reveal direction="up" delay={delay}>
      <div
        className={`group relative flex flex-col gap-5 rounded-3xl border p-6 transition ${
          highlight
            ? "border-primary/40 bg-gradient-to-b from-primary/10 to-transparent"
            : "border-border bg-surface hover:border-border-strong"
        }`}
        style={{ boxShadow: highlight ? "var(--shadow-glow)" : "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">{step}</span>
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${highlight ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"}`}>
            {icon}
          </span>
        </div>
        {visual}
        <div>
          <h3 className="font-display text-2xl">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- WORKFLOW ---------------- */
function Workflow() {
  const rows = [
    { t: "00:00.00", label: "Trigger", detail: "Hotkey S pressed", icon: Lightning },
    { t: "00:00.42", label: "Buffer freeze", detail: "60s pulled from edge cache · 1080p60", icon: Timer },
    { t: "00:01.10", label: "Auto reframe", detail: "Speaker-tracking → 9:16 with headroom", icon: Scissors },
    { t: "00:02.65", label: "Transcribe", detail: "Whisper-tuned model · word-level timing", icon: Waveform },
    { t: "00:03.30", label: "Animate captions", detail: "Brand font, per-word pop, emoji burn", icon: ClosedCaptioning },
    { t: "00:04.20", label: "Publish", detail: "Posted to @yourhandle on TikTok · draft to Shorts + Reels", icon: TiktokLogo },
  ];
  return (
    <section id="workflow" className="relative border-t border-border bg-surface/40 py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionEyebrow>Under the hood</SectionEyebrow>
          <h2 className="font-display mt-4 text-5xl leading-[1] md:text-6xl">
            4.2 seconds<br/>from moment to feed.
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Hash runs a low-latency edge buffer for every stream you're
            watching. When you snatch, the pipeline is already warm — models,
            renderers and TikTok's API are queued and waiting.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["FFmpeg edge", "Whisper v3", "Speaker tracking", "TikTok Direct Post"].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>

        <ol className="relative border-l border-border-strong pl-8">
          {rows.map((r, i) => (
            <Reveal as="li" key={i} direction="up" delay={i * 90} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] top-1 grid h-8 w-8 place-items-center rounded-full border border-border-strong bg-background">
                <r.icon size={14} className="text-primary" />
              </span>
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="font-display text-2xl">{r.label}</h4>
                <span className="font-mono text-xs text-muted-foreground">{r.t}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const feats = [
    {
      icon: Robot,
      title: "AI moment detection",
      body: "Optional co-pilot listens to chat spikes and audio energy. It suggests clips before you even reach for the key.",
    },
    {
      icon: Queue,
      title: "Multi-stream deck",
      body: "Open up to 6 streams at once. Snatch across creators like a mod team, keep everything in one library.",
    },
    {
      icon: ChatCircleText,
      title: "Chat-triggered clips",
      body: "!clip in Twitch chat. Bot mods can pipe hype moments straight into your queue without leaving OBS.",
    },
    {
      icon: Sparkle,
      title: "Brand caption presets",
      body: "Pick a font, a colorway, a motion style. Every clip you ship looks like it came from the same studio.",
    },
    {
      icon: CircleNotch,
      title: "Rolling 180s buffer",
      body: "Pro plan buffers up to 3 minutes. Trim, extend, or grab a clip from earlier in the same reaction window.",
    },
    {
      icon: TiktokLogo,
      title: "Direct-post everywhere",
      body: "TikTok, Shorts, Reels, X, Bluesky. Auto-write titles or use your own template with variables.",
    },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>Everything else</SectionEyebrow>
            <h2 className="font-display mt-4 text-balance text-5xl leading-[1] md:text-6xl">
              Built by mods,<br/>for the deck they wished existed.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Hash isn't a video editor. It's a live-ops room — designed for
            people whose full-time job is turning a stream into a feed.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {feats.map((f, i) => (
            <Reveal key={f.title} direction="up" delay={(i % 3) * 100} className="group flex flex-col gap-4 bg-background p-8 transition hover:bg-surface">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-primary">
                <f.icon weight="duotone" size={20} />
              </span>
              <h3 className="font-display text-2xl leading-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
function StatsBanner() {
  const stats = [
    { k: "4.2s", v: "avg clip → posted" },
    { k: "60s", v: "rolling live buffer" },
    { k: "12", v: "auto-caption languages" },
    { k: "6M+", v: "clips shipped to date" },
  ];
  return (
    <section className="border-y border-border bg-surface/40 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.k} direction="up" delay={i * 90}>
            <p className="font-display text-5xl md:text-6xl text-primary">{s.k}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.v}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PRICING PREVIEW ---------------- */
function PricingPreview() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 className="font-display mt-4 text-5xl leading-[1] md:text-6xl">Pay for the clips that pop.</h2>
          </div>
          <Link to="/pricing" className="btn-ghost h-11">
            Full breakdown <ArrowUpRight weight="bold" size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <PricingCard
            name="Starter"
            price="$0"
            tag="Just seeing"
            features={["30 clips / month", "1 stream deck", "720p exports", "Watermark on TikTok"]}
            cta="Start free"
          />
          <PricingCard
            name="Creator"
            price="$19"
            tag="Most popular"
            highlight
            features={[
              "500 clips / month",
              "3 stream decks",
              "1080p60 · no watermark",
              "AI moment detection",
              "Brand caption presets",
            ]}
            cta="Go Creator"
          />
          <PricingCard
            name="Studio"
            price="$59"
            tag="For mod teams"
            features={[
              "Unlimited clips",
              "6 stream decks · multi-seat",
              "180s rolling buffer",
              "Chat-triggered !clip bot",
              "Priority render lane",
            ]}
            cta="Go Studio"
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name, price, tag, features, cta, highlight,
}: { name: string; price: string; tag: string; features: string[]; cta: string; highlight?: boolean }) {
  return (
    <div
      className={`relative flex flex-col gap-6 rounded-3xl border p-8 ${
        highlight
          ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent"
          : "border-border bg-surface"
      }`}
      style={{ boxShadow: highlight ? "var(--shadow-glow)" : "var(--shadow-card)" }}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground">
          {tag}
        </span>
      )}
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{name}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-6xl">{price}</span>
          <span className="text-sm text-muted-foreground">/ month</span>
        </div>
        {!highlight && <p className="mt-1 text-xs text-muted-foreground">{tag}</p>}
      </div>
      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle weight="fill" size={16} className="mt-0.5 text-primary shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/signup" className={highlight ? "btn-primary mt-auto" : "btn-ghost mt-auto"}>
        {cta} <ArrowRight weight="bold" size={16} />
      </Link>
    </div>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    {
      q: "Is this actually allowed by Twitch / Kick / YouTube?",
      a: "Yes. Hash records only the streams you're already watching, from the public live feed, exactly like Twitch's own clip button — but with more control over the export. We follow each platform's clip and redistribution policies.",
    },
    {
      q: "How can you post to TikTok while the stream is still live?",
      a: "Because we buffer at the edge, the last 60 seconds are already on our infrastructure by the time you press S. Reframe, captioning and upload run in parallel — average end-to-end is 4.2 seconds.",
    },
    {
      q: "Do I need to install OBS plugins or a desktop app?",
      a: "No. Hash is a browser deck. Paste a stream URL, hit snatch. If you want chat-triggered clips, we ship a Twitch bot you invite in one click.",
    },
    {
      q: "What about copyright and the streamer?",
      a: "You can require creator credit in every post, watermark clips with the streamer's handle, or restrict Hash to streams you have permission for. Studio plans include a whitelist.",
    },
    {
      q: "Can I edit before it posts?",
      a: "Yes — one-click posting is the default, but you can pop the clip into the quick editor for trim, caption tweaks, and cover frame before it ships.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="font-display mt-4 text-5xl leading-[1] md:text-6xl">The usual questions.</h2>
          <p className="mt-6 max-w-sm text-muted-foreground">
            Something else on your mind? Poke us in Discord — real humans, real fast.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full flex-col gap-3 py-6 text-left"
              >
                <div className="flex items-center justify-between gap-6">
                  <h4 className="font-display text-2xl">{it.q}</h4>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition ${isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : ""}`}>
                    <CaretDown weight="bold" size={14} />
                  </span>
                </div>
                {isOpen && <p className="max-w-2xl text-muted-foreground">{it.a}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 100%, oklch(0.9 0.19 122 / 0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <span className="chip">
          <Lightning weight="fill" size={12} className="text-primary" />
          Live snatching in 60 seconds
        </span>
        <h2 className="font-display mt-6 text-balance text-6xl leading-[1] md:text-8xl">
          The next viral moment<br/>
          <em className="italic text-primary">is already streaming.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
          Join 8,400+ creators using Hash to run their live clip pipeline. First 30 clips are on us.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/signup" className="btn-primary h-12 px-6 text-[0.95rem]">
            Start snatching free <ArrowRight weight="bold" size={16} />
          </Link>
          <Link to="/pricing" className="btn-ghost h-12 px-6 text-[0.95rem]">
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-primary" />
      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
