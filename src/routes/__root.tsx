import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CookieConsent } from "@/components/site/CookieConsent";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="chip mx-auto">404 · Off-air</p>
        <h1 className="font-display mt-6 text-7xl">Nothing to clip here.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The stream you were looking for isn't live. Head back to the deck.
        </p>
        <Link to="/" className="btn-primary mt-8">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="chip mx-auto">Signal lost</p>
        <h1 className="font-display mt-6 text-5xl">The feed dropped.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something interrupted the stream. Reconnect or head home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >
            Reconnect
          </button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hash — Clip livestreams the second they pop off" },
      {
        name: "description",
        content:
          "Hash is the live-clipping deck for creators. Snatch the last 60s of any Twitch, Kick or YouTube stream, auto-caption vertical, ship straight to TikTok.",
      },
      { name: "author", content: "Hash" },
      { name: "theme-color", content: "#fcfcfd" },
      { property: "og:title", content: "Hash — Clip livestreams the second they pop off" },
      {
        property: "og:description",
        content:
          "Hash is the live-clipping deck for creators. Snatch the last 60s of any Twitch, Kick or YouTube stream, auto-caption vertical, ship straight to TikTok.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hash — Clip livestreams the second they pop off" },
      { name: "twitter:description", content: "Hash is the live-clipping deck for creators. Snatch the last 60s of any Twitch, Kick or YouTube stream, auto-caption vertical, ship straight to TikTok." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/86bc2278-68cc-4fe3-ba16-c771c4fe4b1f" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/86bc2278-68cc-4fe3-ba16-c771c4fe4b1f" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <DynamicToaster />
      <CookieConsent />
    </QueryClientProvider>
  );
}

function DynamicToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const check = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return <Toaster theme={theme} position="bottom-right" richColors closeButton />;
}
