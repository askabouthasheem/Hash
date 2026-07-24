import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { Logo } from "@/components/site/Logo";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
  head: () => ({
    meta: [
      { title: "Join the Hash Waitlist" },
      { name: "description", content: "Hash is currently in private beta. Join the waitlist to get early access." },
    ],
  }),
});

function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // Here you would typically send the email to your backend/Supabase
      // For now, we'll just simulate success.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitted(true);
      toast.success("Thanks for joining the waitlist!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block [&_*]:!border-white/10 pointer-events-none">
        <div aria-hidden className="absolute inset-0" style={{
          background: "oklch(0.15 0.006 250)",
        }} />
        <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <a href="/">
            <Logo />
          </a>

          <div className="max-w-md">
            <span className="chip border-white/20 bg-white/10 text-white">
              <span className="h-2 w-2 rounded-full bg-live live-pulse" /> Live · 12,481 clips shipping now
            </span>
            <h2 className="font-display mt-6 text-5xl leading-[1] text-white">
              "We clipped a moment mid-stream, posted to TikTok, and had 40k views before the streamer even hit the ad break."
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/30 text-white font-display text-lg">m</div>
              <div>
                <p className="text-sm font-medium text-white">Mira Okafor</p>
                <p className="text-xs text-white/70">Community lead · @vexy_live</p>
              </div>
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Live-clip deck · Twitch · Kick · YouTube · TikTok
          </p>
        </div>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <a href="/">
            <Logo />
          </a>
          <a href="/login" className="text-sm text-muted-foreground">
            Sign in
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <p className="chip">Coming Soon</p>
            <h1 className="font-display mt-4 text-5xl leading-[1]">Join the waitlist.</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Hash is currently in private beta. Enter your email to be notified when we launch.
            </p>

            {!submitted ? (
              <form className="grid gap-4 mt-8" onSubmit={handleSubmit}>
                <Field label="Email">
                  <input className="input" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.gg" />
                </Field>
                <button type="submit" disabled={busy} className="btn-primary mt-2 h-12">
                  {busy ? <CircleNotch className="animate-spin" size={16} /> : <>
                    Join Waitlist <ArrowRight weight="bold" size={16} />
                  </>}
                </button>
              </form>
            ) : (
              <div className="mt-8 text-center text-primary">
                <p>🎉 You're on the list!</p>
                <p className="mt-2 text-sm text-muted-foreground">We'll email you when Hash is ready.</p>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-foreground underline underline-offset-4">
                Sign in
              </a>
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
          box-shadow: 0 0 0 3px oklch(0.25 0.02 250 / 0.18);
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
