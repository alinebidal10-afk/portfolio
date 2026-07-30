import { Linkedin, Mail } from "lucide-react";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/components/hero/hero.constants";
import { Section } from "./Section";

const LINK_CLASSES =
  "inline-flex items-center gap-2 rounded-sm text-lg text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="mt-10 text-lg leading-relaxed text-[var(--ink)]">
        {/* TODO(copy): one-line invitation to get in touch. */}
        [TODO: one-line invitation to get in touch.]
      </p>
      <div className="mb-16 mt-8 flex flex-col gap-4 sm:flex-row sm:gap-10">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASSES}
        >
          <Linkedin className="size-5" aria-hidden="true" />
          LinkedIn
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASSES}>
          <Mail className="size-5" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </Section>
  );
}
