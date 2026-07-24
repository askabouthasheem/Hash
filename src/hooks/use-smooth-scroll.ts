import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Reluctant smooth scroll: high lerp resistance, long duration.
 * Feels like the page is being tugged rather than snapped.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      // custom easing — heavy start, gentle glide out
      easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
      lerp: 0.075,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
