import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash as HashIcon, TwitchLogo, GoogleLogo, ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Hash" },
      { name: "description", content: "Sign back into your Hash clip deck." },
    ],
  }),
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const [show, setShow] = useState(false);
  const isLogin = mode === "login";

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left visual */}
      <aside className="relative hidden overflow-hidden border-r border-border lg:block">
        <div aria-hidden className="absolute inset-0" style={{
          background: "radial-gradient(80% 60% at 20% 20%, oklch(0.35 0.14 300 / 0.7), transparent 60%), radial-gradient(80% 60% at 90% 90%, oklch(0.9 0.19 122 / 0.35), transparent 60%), linear-gradient(180deg, oklch(0.16 0.02 260), oklch(0.13 0.02 260))"
        }} />
        <div className="absolute inset-0 grid-lines opacity-30" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <HashIcon weight="bold" size={18} />
            </span>
            <span className="font-display text-2xl">Hash</span>
          </Link>

          <div className="max-w-md">
            <span className="chip">
              <span className="h-2 w-2 rounded-full bg-live live-pulse" /> Live · 12,481 clips shipping now
            </span>
            <h2 className="font-display mt-6 text-5xl leading-[1]">
              "We clipped a moment mid-stream, posted to TikTok, and had 40k views before the streamer even hit the ad break."
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">m</div>
              <div>
                <p className="text-sm font-medium">Mira Okafor</p>
                <p className="text-xs text-muted-foreground">Community lead · @vexy_live</p>
              </div>
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Live-clip deck · Twitch · Kick · YouTube · TikTok
          </p>
        </div>
      </aside>

      {/* Right form */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <HashIcon weight="bold" size={18} />
            </span>
            <span className="font-display text-2xl">Hash</span>
          </Link>
          <Link to={isLogin ? "/signup" : "/login"} className="text-sm text-muted-foreground">
            {isLogin ? "Create account" : "Sign in"}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <p className="chip">{isLogin ? "Welcome back" : "Get started"}</p>
            <h1 className="font-display mt-4 text-5xl leading-[1]">
              {isLogin ? "Sign in to Hash." : "Make your first clip in 60s."}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {isLogin
                ? "Pick up where you left off — your deck's still warm."
                : "No card required. 30 free clips a month, forever."}
            </p>

            <div className="mt-8 grid gap-2">
              <button className="btn-ghost h-11 w-full">
                <TwitchLogo weight="fill" size={16} /> Continue with Twitch
              </button>
              <button className="btn-ghost h-11 w-full">
                <GoogleLogo weight="bold" size={16} /> Continue with Google
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <Field label="Display name">
                  <input className="input" placeholder="clipmaster_9000" />
                </Field>
              )}
              <Field label="Email">
                <input className="input" type="email" placeholder="you@studio.gg" />
              </Field>
              <Field
                label="Password"
                right={isLogin ? <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</a> : null}
              >
                <div className="relative">
                  <input className="input pr-10" type={show ? "text" : "password"} placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password"
                  >
                    {show ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <button type="submit" className="btn-primary mt-2 h-12">
                {isLogin ? "Sign in" : "Create account"} <ArrowRight weight="bold" size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "New to Hash? " : "Already have an account? "}
              <Link to={isLogin ? "/signup" : "/login"} className="text-foreground underline underline-offset-4">
                {isLogin ? "Create an account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .input {
          width: 100%;
          height: 2.75rem;
          padding-inline: 0.9rem;
          border-radius: 0.75rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
          color: var(--color-foreground);
          font-size: 0.9rem;
          outline: none;
          transition: border 0.15s ease, box-shadow 0.15s ease;
        }
        .input::placeholder { color: var(--color-muted-foreground); }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px oklch(0.9 0.19 122 / 0.18);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, right }: { label: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label} {right}
      </span>
      {children}
    </label>
  );
}
