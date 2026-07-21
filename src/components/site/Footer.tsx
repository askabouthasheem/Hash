import { Link } from "@tanstack/react-router";
import {
  Hash as HashIcon,
  TwitterLogo,
  DiscordLogo,
  GithubLogo,
  TiktokLogo,
} from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <HashIcon weight="bold" size={18} />
              </span>
              <span className="font-display text-2xl">Hash</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The live-clipping deck for streamers, editors and community mods.
              Turn 60 seconds of chaos into your next viral post.
            </p>
            <div className="mt-6 flex gap-2">
              {[TwitterLogo, DiscordLogo, TiktokLogo, GithubLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["Live Snatch", "/#snatch"],
              ["Workflow", "/#workflow"],
              ["Pricing", "/pricing"],
              ["Changelog", "#"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["Manifesto", "#"],
              ["Creators", "#"],
              ["Careers", "#"],
              ["Press kit", "#"],
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              ["Docs", "#"],
              ["API", "#"],
              ["Status", "#"],
              ["Support", "#"],
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hash Labs, Inc. Not affiliated with Twitch, Kick, YouTube or TikTok.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">DMCA</a>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="font-display pointer-events-none select-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[22vw] leading-none text-foreground/[0.03]"
      >
        # hash
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("/") && !href.includes("#") ? (
              <Link to={href} className="text-sm text-foreground/80 hover:text-foreground">{label}</Link>
            ) : (
              <a href={href} className="text-sm text-foreground/80 hover:text-foreground">{label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
