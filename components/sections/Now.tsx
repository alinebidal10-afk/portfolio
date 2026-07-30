import { Section } from "./Section";

export function Now() {
  return (
    <Section id="now" title="Now">
      <p className="mt-10 text-lg leading-relaxed text-[var(--ink)]">
        {/* TODO(copy): 3–4 sentences on what you're working on right now. */}
        [TODO: three-to-four sentences on what you are working on right now.]
      </p>
    </Section>
  );
}
