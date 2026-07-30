import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="About">
      <p className="mt-10 text-xl leading-relaxed text-[var(--ink)]">
        {/* TODO(copy): 2-sentence lede — who you are, in two sentences. */}
        [TODO: two-sentence lede introducing who you are.]
      </p>
      <p className="mt-6 text-lg leading-relaxed text-[var(--ink)]">
        {/* TODO(copy): 3–4 sentence body — background, how you work, what
            drives you. */}
        [TODO: three-to-four sentence body paragraph with your background and
        how you work.]
      </p>
    </Section>
  );
}
