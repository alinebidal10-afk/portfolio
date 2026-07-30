"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import {
  REVEAL_ROOT_MARGIN,
  REVEAL_STAGGER_MS,
} from "@/components/hero/hero.constants";

/**
 * IntersectionObserver reveal wrapper: each direct child fades in and rises
 * 12px over 500ms (values in globals.css under .reveal-item), staggered
 * REVEAL_STAGGER_MS per child. Renders the final state immediately under
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-revealed={shown || undefined}>
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          className="reveal-item"
          style={{ transitionDelay: `${i * REVEAL_STAGGER_MS}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
