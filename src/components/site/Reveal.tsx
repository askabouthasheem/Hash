import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Direction = "up" | "left" | "right" | "scale" | "blur";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li";
  amount?: number;
  once?: boolean;
}

/**
 * Scroll-triggered reveal. Streams elements in as they enter the viewport,
 * synced with the smooth scroll for a "buffered" streaming feel.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
  amount = 0.15,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Immediately reveal elements already in view on mount
    // Use setTimeout to ensure initial hidden state is rendered first
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;
      if (isVisible) {
        setVisible(true);
        if (once) io.unobserve(el);
      }
    }, 50);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [amount, once]);

  const initial: Record<Direction, string> = {
    up: "translate3d(0, 60px, 0)",
    left: "translate3d(-60px, 0, 0)",
    right: "translate3d(60px, 0, 0)",
    scale: "scale(0.96)",
    blur: "translate3d(0, 16px, 0)",
  };

  const style: CSSProperties = {
    transform: visible ? "translate3d(0,0,0) scale(1)" : initial[direction],
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : direction === "blur" ? "blur(10px)" : "blur(0px)",
    transition: `transform 1.1s cubic-bezier(0.19, 1, 0.22, 1) ${delay}ms, opacity 0.9s ease ${delay}ms, filter 0.9s ease ${delay}ms`,
    willChange: "transform, opacity, filter",
  };

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
}
