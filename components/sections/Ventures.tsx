import { Section } from "./Section";

const VENTURES = [
  {
    name: "LiFlows",
    // TODO(copy): one-line project descriptor.
    blurb: "[TODO: one-line descriptor for LiFlows.]",
  },
  {
    name: "Atlantic",
    // TODO(copy): one-line project descriptor.
    blurb: "[TODO: one-line descriptor for Atlantic.]",
  },
  {
    name: "uplico",
    // TODO(copy): one-line descriptor for the GTM work at uplico.
    blurb: "[TODO: one-line descriptor for the GTM work at uplico.]",
  },
];

export function Ventures() {
  return (
    <Section id="ventures" title="Ventures">
      {VENTURES.map((v) => (
        <div key={v.name} className="mt-10 border-t border-[var(--accent-dim)]/40 pt-6 first-of-type:mt-10">
          <h3 className="text-lg font-medium text-[var(--ink)]">{v.name}</h3>
          <p className="mt-2 text-lg leading-relaxed text-[var(--ink-dim)]">{v.blurb}</p>
        </div>
      ))}
    </Section>
  );
}
