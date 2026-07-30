import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared shell for the scroll sections: opaque dark background (covers the
 * fixed hero stage), generous measure, hairline + small-caps heading, and
 * staggered reveal of everything inside.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative z-10 bg-[var(--bg)] px-6 py-32">
      <div className="mx-auto max-w-[62ch]">
        <Reveal>
          <div>
            <div className="h-px w-12 bg-[var(--accent-dim)]" />
            <h2 className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-[var(--accent-soft)]">
              {title}
            </h2>
          </div>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
