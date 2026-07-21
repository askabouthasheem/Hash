import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Hash as HashIcon,
  SquaresFour,
  FilmSlate,
  Broadcast,
  CalendarBlank,
  ChartLineUp,
  Gear,
  Question,
  MagnifyingGlass,
  Bell,
  Plus,
  Scissors,
  Waveform,
  ClosedCaptioning,
  TiktokLogo,
  YoutubeLogo,
  TwitchLogo,
  InstagramLogo,
  ChatCircleText,
  Sparkle,
  ArrowsOut,
  SpeakerHigh,
  Play,
  Pause,
  DotsThreeVertical,
  ArrowUpRight,
  CheckCircle,
  Fire,
  Lightning,
  Heart,
  UsersThree,
  Timer,
  CaretDoubleLeft,
  CaretDoubleRight,
  Sliders,
  DownloadSimple,
  LinkSimple,
  SignOut,
  Trash,
  CircleNotch,
  WarningCircle,
} from "@phosphor-icons/react";
import { useClips, type ClipRow } from "@/hooks/use-clips";
import { useSession, signOut, displayName } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Deck — Hash" },
      { name: "description", content: "Your live-clip mission control." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

/* ---------------- SHELL ---------------- */
function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [snatching, setSnatching] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const triggerSnatch = () => {
    if (snatching) return;
    setSnatching(true);
    setToast("Snatched · Rendering 60s → 9:16…");
    setTimeout(() => setToast("Captions burning · EN → 12 langs"), 1400);
    setTimeout(() => setToast("Posted to @vexyclips on TikTok · 4.2s"), 2900);
    setTimeout(() => { setToast(null); setSnatching(false); }, 5200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && !e.metaKey && !e.ctrlKey) triggerSnatch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="grid min-w-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
          <div className="flex min-w-0 flex-col gap-4">
            <NewClipBar />
            <LivePlayer snatching={snatching} onSnatch={triggerSnatch} />
            <MomentTimeline />
            <RealClipsStrip />
          </div>
          <aside className="flex min-w-0 flex-col gap-4">
            <RealQueuePanel />
            <ChatPanel />
          </aside>
        </main>
      </div>

      {toast && <Toast text={toast} />}
    </div>
  );
}

/* ---------------- SIDEBAR ---------------- */
function SidebarNav({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const groups: { label: string; items: { icon: any; name: string; badge?: string; active?: boolean }[] }[] = [
    {
      label: "Deck",
      items: [
        { icon: Broadcast, name: "Live now", active: true, badge: "3" },
        { icon: SquaresFour, name: "Multi-deck" },
        { icon: CalendarBlank, name: "Scheduled" },
      ],
    },
    {
      label: "Library",
      items: [
        { icon: FilmSlate, name: "Clips", badge: "182" },
        { icon: ChartLineUp, name: "Performance" },
        { icon: Sparkle, name: "AI moments", badge: "New" },
      ],
    },
    {
      label: "Workspace",
      items: [
        { icon: UsersThree, name: "Team" },
        { icon: Sliders, name: "Presets" },
        { icon: Gear, name: "Settings" },
      ],
    },
  ];

  const w = collapsed ? "w-[72px]" : "w-[248px]";

  return (
    <nav className={`${w} sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface/50 transition-[width] duration-200 md:flex`}>
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <HashIcon weight="bold" size={18} />
          </span>
          {!collapsed && <span className="font-display text-2xl leading-none">Hash</span>}
        </Link>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-surface-2">
            <CaretDoubleLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-surface-2">
          <CaretDoubleRight size={14} />
        </button>
      )}

      <div className={`px-3 ${collapsed ? "pt-1" : ""}`}>
        <button className={`btn-primary w-full ${collapsed ? "!h-10 !px-0" : "h-10"}`}>
          <Plus weight="bold" size={16} />
          {!collapsed && "Add stream"}
        </button>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-2">
        {groups.map((g) => (
          <div key={g.label} className="mb-6">
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{g.label}</p>
            )}
            <ul className="grid gap-1">
              {g.items.map((it) => (
                <li key={it.name}>
                  <button
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      it.active
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    }`}
                    title={collapsed ? it.name : undefined}
                  >
                    <it.icon weight={it.active ? "fill" : "regular"} size={18} className={it.active ? "text-primary" : ""} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{it.name}</span>
                        {it.badge && (
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            it.badge === "New" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
                          }`}>
                            {it.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User card */}
      <UserCard collapsed={collapsed} />
    </nav>
  );
}

function UserCard({ collapsed }: { collapsed: boolean }) {
  const { user } = useSession();
  const navigate = useNavigate();
  const name = displayName(user);
  const initial = (name[0] || "h").toUpperCase();
  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }
  return (
    <div className="border-t border-border p-3">
      <div className={`flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2 ${collapsed ? "justify-center" : ""}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">{initial}</div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name || "Signed in"}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={handleSignOut} title="Sign out" className="text-muted-foreground hover:text-foreground">
            <SignOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- TOP BAR ---------------- */
function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Live now</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">vexy_live</span>
        <span className="chip !ml-2">
          <span className="h-1.5 w-1.5 rounded-full bg-live live-pulse" /> LIVE
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search clips, streams…"
            className="h-10 w-72 rounded-full border border-border bg-surface pl-9 pr-16 text-sm outline-none focus:border-primary/60"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
        </div>
        <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-surface">
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-live" />
        </button>
        <button className="btn-ghost h-10 hidden lg:inline-flex">
          <Question size={16} /> Docs
        </button>
      </div>
    </header>
  );
}

/* ---------------- PLAYER ---------------- */
function LivePlayer({ snatching, onSnatch }: { snatching: boolean; onSnatch: () => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border-strong bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">v</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">vexy_live</p>
            <p className="truncate text-xs text-muted-foreground">Ranked Apex · "get in loser, we're pushing zone"</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">
            <TwitchLogo weight="fill" size={12} /> Twitch
          </span>
          <span className="chip">
            <UsersThree size={12} /> 24,881
          </span>
          <button className="btn-ghost h-9 !px-3">
            <ArrowsOut size={14} />
          </button>
        </div>
      </div>

      {/* stream */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, oklch(0.35 0.14 300 / 0.9), transparent 60%), radial-gradient(120% 90% at 90% 90%, oklch(0.4 0.18 200 / 0.85), transparent 55%), linear-gradient(180deg, oklch(0.22 0.03 260), oklch(0.14 0.02 260))",
          }}
        />
        <div className="absolute inset-0 grid-lines opacity-40" />

        {/* live badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-live live-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest">LIVE 1080p60</span>
        </div>

        {/* mock caption */}
        <div className="absolute inset-x-8 bottom-24 text-center">
          <span
            className="font-display text-3xl italic md:text-5xl"
            style={{
              background: "var(--grad-lime)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 6px 30px oklch(0.9 0.19 122 / 0.35)",
            }}
          >
            "bro just clutched the 1v4"
          </span>
        </div>

        {/* snatch flash */}
        {snatching && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <Scissors weight="fill" size={26} />
              </div>
              <p className="font-display text-2xl">Snatched.</p>
            </div>
          </div>
        )}

        {/* controls */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20">
              <Pause weight="fill" size={16} />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20">
              <SpeakerHigh weight="fill" size={16} />
            </button>
            <div className="ml-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
              <Waveform size={14} className="text-primary" />
              <span className="font-mono text-[11px] text-muted-foreground">buffer −00:60 → NOW</span>
            </div>
          </div>
          <button
            onClick={onSnatch}
            disabled={snatching}
            className="btn-primary h-12 px-6 text-base disabled:opacity-70"
          >
            <Scissors weight="bold" size={18} />
            {snatching ? "Snatching…" : "Snatch clip"}
            <kbd className="ml-1 rounded border border-black/20 bg-black/10 px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
          </button>
        </div>
      </div>

      {/* under-player quick actions */}
      <div className="grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border sm:grid-cols-4">
        <QuickStat icon={Timer} label="Buffer" value="60s" />
        <QuickStat icon={Fire} label="Chat spike" value="+412%" trend />
        <QuickStat icon={ClosedCaptioning} label="Captions" value="Brand v3" />
        <QuickStat icon={TiktokLogo} label="Auto-post" value="On · @vexyclips" />
      </div>
    </section>
  );
}

function QuickStat({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-surface p-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-primary">
        <Icon weight="duotone" size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className={`truncate text-sm font-medium ${trend ? "text-primary" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

/* ---------------- MOMENT TIMELINE ---------------- */
function MomentTimeline() {
  // Fixed pseudo-random heights so no hydration weirdness
  const bars = [12,18,22,16,14,20,32,28,44,60,72,50,38,28,22,18,26,42,58,80,92,74,55,40,30,22,18,20,26,34,48,66,52,38,24,20,18,22,30,42,58,70,58,44,30,22,18,16,20,28];
  const moments = [
    { at: 18, label: "Chat spike", type: "chat" },
    { at: 32, label: "Audio pop", type: "audio" },
    { at: 44, label: "AI moment", type: "ai" },
  ];
  return (
    <section className="rounded-3xl border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Session timeline</p>
          <h3 className="font-display mt-1 text-2xl">Last 5 minutes</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Legend color="bg-primary" label="You" />
          <Legend color="bg-live" label="Chat" />
          <Legend color="bg-[oklch(0.75_0.15_240)]" label="AI" />
        </div>
      </div>

      <div className="relative mt-6 h-32">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="flex h-full items-end gap-[3px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-border-strong/80"
              style={{ height: `${h}%`, opacity: 0.3 + h / 150 }}
            />
          ))}
        </div>
        {moments.map((m) => (
          <div
            key={m.at}
            className="absolute -top-1 flex -translate-x-1/2 flex-col items-center gap-1"
            style={{ left: `${(m.at / bars.length) * 100}%` }}
          >
            <span className={`h-3 w-3 rounded-full ring-2 ring-background ${
              m.type === "chat" ? "bg-live" : m.type === "ai" ? "bg-[oklch(0.75_0.15_240)]" : "bg-primary"
            }`} />
            <span className="whitespace-nowrap rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {m.label}
            </span>
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 flex flex-col items-center gap-1 pl-2">
          <span className="h-full w-px bg-primary" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-mono">−05:00</span>
        <span>Scroll to scrub · Click a marker to snatch that moment</span>
        <span className="font-mono text-primary">NOW</span>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${color}`} /> {label}
    </span>
  );
}

/* ---------------- RECENT CLIPS ---------------- */
function ClipStrip() {
  const clips = [
    { title: "1v4 clutch, no sound", ago: "12s", views: "2.1k", where: TiktokLogo, live: true },
    { title: "chat lost it", ago: "3m", views: "18.4k", where: TiktokLogo },
    { title: "the pathing was insane", ago: "11m", views: "42.1k", where: YoutubeLogo },
    { title: "\"who queued this\"", ago: "24m", views: "6.8k", where: InstagramLogo },
    { title: "final zone edit", ago: "38m", views: "91.2k", where: TiktokLogo },
  ];
  return (
    <section className="rounded-3xl border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Just shipped</p>
          <h3 className="font-display mt-1 text-2xl">Today's clips</h3>
        </div>
        <button className="btn-ghost h-9 !px-3 text-xs">
          Library <ArrowUpRight weight="bold" size={12} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {clips.map((c, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-2">
            <div className="relative aspect-[9/16] w-full">
              <div className="absolute inset-0" style={{
                background: `linear-gradient(${140 + i*20}deg, oklch(0.3 0.1 ${240 + i*30}), oklch(0.16 0.02 260))`
              }} />
              <div className="absolute inset-0 grid-lines opacity-30" />
              {c.live && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-live/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <span className="h-1 w-1 rounded-full bg-white" /> UPLOADING
                </span>
              )}
              <button className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black">
                  <Play weight="fill" size={14} />
                </span>
              </button>
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] backdrop-blur">{c.ago}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black/60 backdrop-blur">
                  <c.where weight="fill" size={11} />
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium">{c.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Heart size={10} /> {c.views}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CHAT ---------------- */
function ChatPanel() {
  const msgs = [
    { u: "mira_mod", c: "!clip that was nasty", role: "MOD" },
    { u: "vexy_fan_88", c: "NO WAYYYYYY", hype: true },
    { u: "quinnie", c: "clipppp" },
    { u: "wizardhat", c: "the pathing >>>" },
    { u: "hash_bot", c: "clip queued · id #2814", role: "BOT" },
    { u: "kaia", c: "post this NOW" },
    { u: "vexy_fan_88", c: "@vexy 1v4 king" },
  ];
  return (
    <section className="flex min-h-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ChatCircleText weight="duotone" size={18} className="text-primary" />
          <h3 className="text-sm font-semibold">Stream chat</h3>
          <span className="chip !py-0.5">!clip enabled</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <Gear size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${m.hype ? "bg-primary/10" : "hover:bg-surface-2"}`}>
            {m.role && (
              <span className={`mt-0.5 rounded px-1 py-0.5 text-[9px] font-bold ${
                m.role === "MOD" ? "bg-primary/20 text-primary" : "bg-[oklch(0.4_0.15_200)]/30 text-[oklch(0.75_0.15_200)]"
              }`}>
                {m.role}
              </span>
            )}
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">{m.u}</span>
            <span className="min-w-0 break-words text-sm">{m.c}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface-2 px-3">
          <Lightning size={14} className="text-muted-foreground" />
          <input placeholder="Send to chat…" className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <kbd className="rounded border border-border-strong px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">↵</kbd>
        </div>
      </div>
    </section>
  );
}

/* ---------------- QUEUE ---------------- */
function QueuePanel() {
  const items = [
    { id: "#2814", title: "1v4 clutch, no sound", status: "posting", where: "TikTok", progress: 82 },
    { id: "#2813", title: "chat lost it", status: "captioning", where: "TikTok · Shorts", progress: 45 },
    { id: "#2812", title: "\"who queued this\"", status: "queued", where: "Reels", progress: 8 },
  ];
  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Waveform weight="duotone" size={18} className="text-primary" />
          <h3 className="text-sm font-semibold">Render queue</h3>
        </div>
        <span className="chip !py-0.5">3 in flight</span>
      </div>

      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{it.id}</span>
                  <span className={`chip !py-0.5 !text-[10px] ${
                    it.status === "posting" ? "!border-primary/40 !text-primary" : ""
                  }`}>
                    {it.status === "posting" && <Lightning weight="fill" size={10} className="text-primary" />}
                    {it.status === "captioning" && <ClosedCaptioning size={10} />}
                    {it.status === "queued" && <Timer size={10} />}
                    {it.status}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-medium">{it.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">→ {it.where}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <DotsThreeVertical size={16} />
              </button>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${it.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-border p-3">
        <button className="btn-ghost h-10 w-full text-sm">
          <DownloadSimple size={14} /> Export all as MP4
        </button>
      </div>
    </section>
  );
}

/* ---------------- TOAST ---------------- */
function Toast({ text }: { text: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border-strong bg-surface/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle weight="fill" size={14} />
        </span>
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}
