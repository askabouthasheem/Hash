import { Link } from "@tanstack/react-router";
import { Hash as HashIcon, List, X } from "@phosphor-icons/react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <HashIcon weight="bold" size={18} />
          </span>
          <span className="font-display text-2xl leading-none">Hash</span>
          <span className="chip ml-2 hidden sm:inline-flex">Beta</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#snatch" className="text-sm text-muted-foreground hover:text-foreground transition">Live Snatch</a>
          <a href="/#workflow" className="text-sm text-muted-foreground hover:text-foreground transition">Workflow</a>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</Link>
          <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition">FAQ</a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition px-3">Sign in</Link>
          <Link to="/signup" className="btn-primary h-10">Start clipping</Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-5 py-4">
            <a onClick={() => setOpen(false)} href="/#snatch" className="rounded-lg px-3 py-2 text-sm hover:bg-surface-2">Live Snatch</a>
            <a onClick={() => setOpen(false)} href="/#workflow" className="rounded-lg px-3 py-2 text-sm hover:bg-surface-2">Workflow</a>
            <Link onClick={() => setOpen(false)} to="/pricing" className="rounded-lg px-3 py-2 text-sm hover:bg-surface-2">Pricing</Link>
            <a onClick={() => setOpen(false)} href="/#faq" className="rounded-lg px-3 py-2 text-sm hover:bg-surface-2">FAQ</a>
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="btn-ghost flex-1 h-10">Sign in</Link>
              <Link to="/signup" className="btn-primary flex-1 h-10">Start</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
