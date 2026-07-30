"use client";

import { useEffect, useRef, useState } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  TEXT_LEFT_FRACTION,
} from "@/components/hero/hero.constants";

const ROW_CLASSES =
  "group inline-flex items-center gap-2 text-lg text-[var(--accent)] underline-offset-4 transition-all hover:translate-x-1 hover:brightness-125 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

export function ContactSection() {
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
      id="contact"
      ref={ref}
      className="relative z-10 flex min-h-[70vh] scroll-mt-24 flex-col justify-center bg-[var(--bg)]"
    >
      <div
        className="w-full py-24 pr-6"
        style={{ paddingLeft: `max(1.5rem, ${TEXT_LEFT_FRACTION * 100}vw)` }}
      >
        <div
          className={`max-w-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-soft)]">
            Contact
          </p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Let&apos;s talk.
          </h2>
          <div className="mt-10 flex flex-col items-start gap-5">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW_CLASSES}
            >
              <Linkedin className="size-5" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW_CLASSES}
            >
              <Instagram className="size-5" aria-hidden="true" />
              Instagram
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className={ROW_CLASSES}>
              <Mail className="size-5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <p className="mt-24 text-xs text-white/30">&copy; 2026 Ali Nebi Dal</p>
      </div>
    </section>
  );
}
