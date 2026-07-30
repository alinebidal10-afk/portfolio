"use client";

import { useEffect, useRef, useState } from "react";
import { TEXT_LEFT_FRACTION } from "@/components/hero/hero.constants";

export function VenturesSection() {
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="ventures"
      ref={ref}
      className="relative z-10 flex min-h-screen scroll-mt-24 items-center bg-[var(--bg)]"
    >
      {/* softens the edge between the hero and this section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-0 h-40 w-full bg-gradient-to-b from-transparent to-[var(--bg)]"
      />
      <div
        className="w-full pr-6 py-24"
        style={{ paddingLeft: `max(1.5rem, ${TEXT_LEFT_FRACTION * 100}vw)` }}
      >
        <div
          className={`max-w-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-soft)]">
            Ventures
          </p>
          <span className="mt-5 inline-block rounded-full border border-[var(--accent-dim)] px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--accent-soft)]">
            STEALTH &middot; 2026
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Building in the creator economy.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            I&apos;m building infrastructure for the creator economy &mdash; the
            layer that turns what a creator knows into something people can
            actually follow, day by day, instead of a video they never finish.
            We&apos;re in stealth for now.
          </p>
          <p className="mt-6 text-lg text-[var(--accent)]">More soon.</p>
        </div>
      </div>
    </section>
  );
}
