import { useEffect, useState } from "react";
import { Cookie, ShieldCheck, X, SlidersHorizontal, Check } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";

export type CookiePreferences = {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp?: string;
};

const STORAGE_KEY = "hash_cookie_consent";

export function triggerCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check local storage for consent
    const storedConsent = localStorage.getItem(STORAGE_KEY);
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent);
        setPreferences({
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      } catch (e) {
        console.error("Failed to parse cookie consent", e);
      }
    } else {
      // Delay initial banner appearance slightly for polished UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenPrefs = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPrefs);
    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpenPrefs);
    };
  }, []);

  const saveConsent = (updatedPrefs: CookiePreferences) => {
    const fullPrefs: CookiePreferences = {
      ...updatedPrefs,
      necessary: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));
    setPreferences(fullPrefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible && !showPreferences) return null;

  return (
    <>
      {/* Floating Bottom Banner */}
      {isVisible && !showPreferences && (
        <div
          role="dialog"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-border-strong bg-card/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 md:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-foreground">
              <Cookie size={22} weight="bold" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-base font-semibold tracking-tight text-foreground">
                  We value your privacy
                </h3>
                <button
                  onClick={handleRejectOptional}
                  className="text-muted-foreground transition hover:text-foreground cursor-pointer"
                  aria-label="Close cookie banner with essential settings"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                We use cookies to analyze traffic, keep live sessions fast, and enhance your clipping workflow.
                You can accept all or manage your preferences anytime.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary text-xs !h-9 !px-4 cursor-pointer"
                >
                  Accept all
                </button>
                <button
                  onClick={handleRejectOptional}
                  className="btn-ghost text-xs !h-9 !px-4 cursor-pointer"
                >
                  Essential only
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline cursor-pointer ml-auto sm:ml-0"
                >
                  <SlidersHorizontal size={14} />
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowPreferences(false)}
          />

          <div
            role="dialog"
            aria-label="Cookie preferences"
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border-strong bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 sm:p-7"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={24} className="text-foreground" weight="bold" />
                <div>
                  <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
                    Cookie Preferences
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage how Hash uses cookies and local data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface hover:text-foreground cursor-pointer"
                aria-label="Close preferences"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-surface/40 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Strictly Necessary</span>
                    <span className="chip text-[0.65rem] !py-0.5 !px-2">Required</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Essential for secure authentication, stream buffer caching, and account state. Cannot be disabled.
                  </p>
                </div>
                <div className="pt-0.5">
                  <Switch checked disabled aria-label="Strictly necessary cookies" />
                </div>
              </div>

              {/* Analytics & Performance */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-surface/40 p-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground">Analytics & Performance</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Helps us measure stream processing speeds, clipping latency, and platform stability.
                  </p>
                </div>
                <div className="pt-0.5">
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                    aria-label="Analytics cookies toggle"
                  />
                </div>
              </div>

              {/* Marketing & Personalization */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-surface/40 p-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground">Marketing & Personalization</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Used to recommend viral clip templates, creator tools, and tailored platform updates.
                  </p>
                </div>
                <div className="pt-0.5">
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, marketing: checked }))
                    }
                    aria-label="Marketing cookies toggle"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={handleRejectOptional}
                className="btn-ghost text-xs !h-9 !px-4 cursor-pointer"
              >
                Reject optional
              </button>
              <button
                onClick={handleSavePreferences}
                className="btn-primary text-xs !h-9 !px-5 cursor-pointer"
              >
                <Check size={14} weight="bold" />
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
