import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Hash as HashIcon, GoogleLogo, ArrowRight, Eye, EyeSlash, CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();
  const isLogin = mode === "login";

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/app" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name || email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created");
          navigate({ to: "/app" });
        } else {
          toast.success("Check your email to confirm.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (googleBusy) return;
    setGoogleBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
      if (result.redirected) return;
      navigate({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
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
                : "No card required. Start clipping instantly."}
            </p>

            <div className="mt-8 grid gap-2">
              <button onClick={handleGoogle} disabled={googleBusy} className="btn-ghost h-11 w-full">
                {googleBusy ? <CircleNotch className="animate-spin" size={16} /> : <GoogleLogo weight="bold" size={16} />}
                Continue with Google
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <form className="grid gap-4" onSubmit={handleEmail}>
              {!isLogin && (
                <Field label="Display name">
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="clipmaster_9000" />
                </Field>
              )}
              <Field label="Email">
                <input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.gg" />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input
                    className="input pr-10"
                    required
                    minLength={8}
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
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

              <button type="submit" disabled={busy} className="btn-primary mt-2 h-12">
                {busy ? <CircleNotch className="animate-spin" size={16} /> : <>{isLogin ? "Sign in" : "Create account"} <ArrowRight weight="bold" size={16} /></>}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
