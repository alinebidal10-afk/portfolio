"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Linkedin } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const WORD_STAGGER = 0.08;

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
  name?: string;
  roles?: string[];
  description?: string;
  linkedinUrl?: string;
  email?: string;
  navItems?: string[];
}

function WordsPullUp({
  text,
  className,
  wordClassName,
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delayOffset?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={wordClassName}
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={
            reduceMotion || isInView ? { y: 0, opacity: 1 } : undefined
          }
          transition={{
            delay: delayOffset + i * WORD_STAGGER,
            duration: 0.6,
            ease: EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

interface StyledSegment {
  text: string;
  className?: string;
}

function WordsPullUpMultiStyle({
  segments,
  className,
  delayOffset = 0,
}: {
  segments: StyledSegment[];
  className?: string;
  delayOffset?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  const words = segments.flatMap((segment, si) =>
    segment.text.split(" ").map((word, wi) => ({ segment, si, word, wi })),
  );
  return (
    <span ref={ref} className={className}>
      {words.map(({ segment, si, word, wi }, wordIndex) => {
        const delay = delayOffset + wordIndex * WORD_STAGGER;
        return (
          <motion.span
            key={`${si}-${wi}`}
            className={segment.className}
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={
              reduceMotion || isInView ? { y: 0, opacity: 1 } : undefined
            }
            transition={{ delay, duration: 0.6, ease: EASE }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

function FadeUp({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({
  videoSrc = "/media/hero.mp4",
  posterSrc = "/media/hero.jpg",
  name = "Ali Nebi",
  roles = ["Entrepreneur", "GTM Specialist"],
  description = "Building products and taking them to market. Based in Istanbul.",
  linkedinUrl,
  email,
  navItems = ["Work", "Projects", "Writing", "Contact"],
}: HeroProps) {
  // Video is only mounted on >=768px viewports, so mobile never downloads it.
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [posterFailed, setPosterFailed] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showVideo = Boolean(videoSrc) && isDesktop && !videoFailed;
  const showPoster = Boolean(posterSrc) && !showVideo && !posterFailed;

  const roleSegments: StyledSegment[] = roles.flatMap((role, i) =>
    i === 0
      ? [{ text: role }]
      : [{ text: "·", className: "opacity-60" }, { text: role }],
  );

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hero-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hero-bg)]";

  return (
    <section
      className="h-screen w-full p-2 sm:p-3"
      style={
        {
          "--hero-fg": "#E1E0CC",
          "--hero-bg": "#0A0A0A",
        } as React.CSSProperties
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[var(--hero-bg)] text-[var(--hero-fg)] md:rounded-[2rem]">
        {/* Fallback when neither video nor poster is available */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#3a372b_0%,#1c1a14_45%,var(--hero-bg)_100%)]"
        />

        {showPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            onError={() => setPosterFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {showVideo && (
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"
        />
        {/* Extra scrim behind the content block: bright photos leave the
            bottom third too light for text on their own. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay"
        />

        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-[var(--hero-bg)] px-3 py-2 sm:px-5 sm:py-3">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--hero-fg)] transition-opacity hover:opacity-70 sm:px-3 sm:text-sm ${focusRing}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-7 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="text-[18vw] font-semibold leading-[0.85] tracking-[-0.06em] sm:text-[16vw] md:text-[15vw] lg:text-[13vw]">
                {/* Each word on its own line: the original design was sized
                    for a single word, so two words side by side overflow on
                    narrow viewports. */}
                <WordsPullUp text={name} wordClassName="block" />
              </h1>
              <p className="mt-4 text-base font-medium uppercase tracking-[0.25em] sm:text-lg md:text-xl">
                <WordsPullUpMultiStyle
                  segments={roleSegments}
                  className="flex flex-wrap items-baseline gap-x-[0.6em] gap-y-1"
                  delayOffset={0.4}
                />
              </p>
            </div>

            <div className="lg:col-span-4">
              <FadeUp delay={0.6}>
                <p className="max-w-md text-sm leading-relaxed opacity-90 sm:text-base">
                  {description}
                </p>
              </FadeUp>
              <FadeUp delay={0.8} className="mt-6 flex items-center gap-3">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={`inline-flex h-12 items-center rounded-full bg-[var(--hero-fg)] px-6 text-sm font-medium text-[var(--hero-bg)] transition-opacity hover:opacity-85 ${focusRing}`}
                  >
                    Get in touch
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--hero-fg)]/40 text-[var(--hero-fg)] transition-colors hover:border-[var(--hero-fg)] ${focusRing}`}
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { HeroProps };
