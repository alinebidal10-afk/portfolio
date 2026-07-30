"use client";

/**
 * Coordinate mapping (v2, full-bleed), so future-me remembers how it works:
 *
 * 1. The video fills the viewport with `object-fit: cover` and
 *    `object-position: ${FIGURE.x*100}% ${FIGURE.y*100}%`. With cover, a
 *    percentage object-position aligns that point of the SOURCE with the
 *    same point of the BOX — so the figure lands at exactly
 *    (FIGURE.x * vw, FIGURE.y * vh) on every viewport, whatever the crop.
 *    That's why there is no ResizeObserver here: the anchor is pure math.
 * 2. The rendered (cover-scaled) video rect is also pure math — used so
 *    glow/hit sizes track the figure's rendered size, and to map tier-2
 *    silhouette coordinates (authored in 1112x834) into viewport space:
 *      scale = max(vw/VIDEO_W, vh/VIDEO_H)
 *      dispW = VIDEO_W*scale, dispH = VIDEO_H*scale
 *      origin = (FIGURE.x*(vw-dispW), FIGURE.y*(vh-dispH))  // from the
 *      object-position identity above; usually negative (off-screen crop).
 * 3. The overlay SVG spans the viewport with viewBox="0 0 vw vh", so
 *    1 SVG unit == 1 CSS px.
 * 4. Composition: the text block sits middle-left (CSS-positioned, then
 *    MEASURED via getBoundingClientRect); the arrow starts just above the
 *    figure's head, runs horizontally toward the text, makes its single
 *    turn, and drops to point down at the name. Portrait/narrow (<768px or
 *    taller-than-wide): same route, but the text sits lower-left because a
 *    vertically-centred block would cover the figure there.
 *
 * Scroll behaviour: the whole stage is position:fixed; the h-[100svh]
 * section only reserves scroll space. Sections after it are opaque and
 * slide up over the stage. An IntersectionObserver on the section drives
 * the darkening veil (1 - visibleRatio) and pauses the videos when the
 * hero is under HERO_PAUSE_VISIBILITY visible.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Linkedin, Mail } from "lucide-react";
import { useViewport } from "./useViewport";
import { HeroArrow, type ArrowRoute } from "./HeroArrow";
import { FigureGlow } from "./FigureGlow";
import { Scrim } from "./Scrim";
import { Calibrator } from "./Calibrator";
import {
  ARROW_LIFT_FRACTION,
  ARROW_RISE_CLEARANCE_PX,
  ARROW_START_SHIFT_FRACTION,
  ARROW_TIP_GAP_PX,
  CONTACT_EMAIL,
  CROSSFADE_LOOP,
  CROSSFADE_S,
  FIGURE,
  HERO_PAUSE_VISIBILITY,
  LINKEDIN_URL,
  PORTRAIT_HIT_SCALE,
  PORTRAIT_MAX_WIDTH_PX,
  PORTRAIT_TEXT_LEFT_PX,
  PORTRAIT_TEXT_TOP_FRACTION,
  POSTER_SRC,
  TEXT_ENTER_DELAY_MS,
  TEXT_ENTER_MS,
  TEXT_LEFT_FRACTION,
  TEXT_SLIDE_PX,
  VIDEO_DURATION_S,
  VIDEO_H,
  VIDEO_POP_MS,
  VIDEO_SRC,
  VIDEO_W,
} from "./hero.constants";

const HOVER_QUERY = "(hover: hover)";

function subscribeToHoverMedia(onChange: () => void) {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// The URL's ?calibrate flag never changes without a navigation.
function subscribeNever() {
  return () => {};
}

const OBJECT_POSITION = `${FIGURE.x * 100}% ${FIGURE.y * 100}%`;

export function HeroFullBleed() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewport = useViewport();

  // --- interaction state -------------------------------------------------
  const canHover = useSyncExternalStore(
    subscribeToHoverMedia,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  );
  const calibrate = useSyncExternalStore(
    subscribeNever,
    () =>
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).get("calibrate") === "1",
    () => false,
  );
  const [glowActive, setGlowActive] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [videoPop, setVideoPop] = useState(false);
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [veil, setVeil] = useState(0);

  const activateGlow = useCallback(() => {
    setGlowActive(true);
    setVideoPop(true);
    if (popTimer.current) clearTimeout(popTimer.current);
    popTimer.current = setTimeout(() => setVideoPop(false), VIDEO_POP_MS);
  }, []);
  const deactivateGlow = useCallback(() => setGlowActive(false), []);

  // Touch devices have no hover: play the glow once as a pulse when the
  // hero scrolls into view.
  useEffect(() => {
    if (canHover || !sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGlowPulse(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [canHover]);

  // --- loop seam ----------------------------------------------------------
  const vidA = useRef<HTMLVideoElement>(null);
  const vidB = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<0 | 1>(0);
  const frontRef = useRef<0 | 1>(0);

  useEffect(() => {
    if (!CROSSFADE_LOOP) return;
    const vids = [vidA.current, vidB.current];
    if (!vids[0] || !vids[1]) return;

    const makeHandler = (idx: 0 | 1) => () => {
      if (idx !== frontRef.current) return;
      const v = vids[idx]!;
      const dur =
        Number.isFinite(v.duration) && v.duration > 0 ? v.duration : VIDEO_DURATION_S;
      if (v.currentTime >= dur - CROSSFADE_S) {
        const next = (1 - idx) as 0 | 1;
        const nv = vids[next]!;
        nv.currentTime = 0;
        void nv.play();
        frontRef.current = next;
        setFront(next);
      }
    };
    const h0 = makeHandler(0);
    const h1 = makeHandler(1);
    vids[0].addEventListener("timeupdate", h0);
    vids[1].addEventListener("timeupdate", h1);
    return () => {
      vids[0]?.removeEventListener("timeupdate", h0);
      vids[1]?.removeEventListener("timeupdate", h1);
    };
  }, []);

  // --- scroll: veil ramp + off-screen pause -------------------------------
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        setVeil(1 - ratio);
        const vids = [vidA.current, vidB.current];
        if (ratio < HERO_PAUSE_VISIBILITY) {
          vids.forEach((v) => v?.pause());
        } else {
          const v = vids[frontRef.current];
          if (v?.paused) void v.play();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // --- geometry (all in viewport px, pure math — see header comment) ------
  const geom = viewport
    ? (() => {
        const { vw, vh } = viewport;
        const portrait = vw < PORTRAIT_MAX_WIDTH_PX || vh > vw;
        const ax = FIGURE.x * vw;
        const ay = FIGURE.y * vh;
        const scale = Math.max(vw / VIDEO_W, vh / VIDEO_H);
        const dispW = VIDEO_W * scale;
        const dispH = VIDEO_H * scale;
        const box = {
          x: FIGURE.x * (vw - dispW),
          y: FIGURE.y * (vh - dispH),
          w: dispW,
          h: dispH,
        };
        return { vw, vh, portrait, ax, ay, box };
      })()
    : null;

  const portrait = geom?.portrait ?? false;

  // The text block is positioned with plain CSS (middle-left on desktop,
  // lower-left in portrait — SSR falls back to the desktop values), then
  // measured so the arrow can aim at where the name actually is.
  const textRef = useRef<HTMLDivElement>(null);
  const [textRect, setTextRect] = useState<{
    top: number;
    left: number;
    right: number;
  } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = textRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTextRect({ top: r.top, left: r.left, right: r.right });
    });
    return () => cancelAnimationFrame(id);
  }, [viewport]);

  const textPos: React.CSSProperties = portrait
    ? {
        left: PORTRAIT_TEXT_LEFT_PX,
        top: `${PORTRAIT_TEXT_TOP_FRACTION * 100}svh`,
      }
    : {
        left: `${TEXT_LEFT_FRACTION * 100}vw`,
        top: "50%",
        transform: "translateY(-50%)",
      };

  // Arrow route: north → west → south. Starts just LEFT of the figure (so
  // it never sits on the character), climbs, crosses above both the start
  // and the text, then drops onto the text block, tip pointing down.
  const arrow: ArrowRoute | null =
    geom && textRect
      ? (() => {
          const sx = geom.ax - ARROW_START_SHIFT_FRACTION * geom.box.w;
          const sy = geom.ay - ARROW_LIFT_FRACTION * geom.box.h;
          const endY = textRect.top - ARROW_TIP_GAP_PX;
          const topY = Math.min(sy, endY) - ARROW_RISE_CLEARANCE_PX;
          const tx = Math.min((textRect.left + textRect.right) / 2, sx - 40);
          return {
            points: [
              { x: sx, y: sy },
              { x: sx, y: topY },
              { x: tx, y: topY },
              { x: tx, y: endY },
            ],
          };
        })()
      : null;

  const videoProps = {
    muted: true,
    playsInline: true,
    disablePictureInPicture: true,
    "aria-hidden": true,
    className: "absolute inset-0 h-full w-full object-cover",
  } as const;

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Intro"
      className="relative h-[100svh] w-full bg-[var(--bg)]"
    >
      {/* Fixed stage: stays put while any scroll content slides up over it. */}
      <div className="fixed inset-0 overflow-hidden bg-[var(--bg)]">
        <div
          className="absolute inset-0"
          style={{
            filter: videoPop ? "brightness(1.06) saturate(1.05)" : undefined,
            transition: `filter ${VIDEO_POP_MS}ms ease-out`,
          }}
        >
          <video
            ref={vidA}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            preload="metadata"
            loop={!CROSSFADE_LOOP}
            {...videoProps}
            style={{
              objectPosition: OBJECT_POSITION,
              ...(CROSSFADE_LOOP && {
                opacity: front === 0 ? 1 : 0,
                transition: `opacity ${CROSSFADE_S * 1000}ms linear`,
              }),
            }}
          />
          {CROSSFADE_LOOP && (
            <video
              ref={vidB}
              src={VIDEO_SRC}
              preload="auto"
              {...videoProps}
              style={{
                objectPosition: OBJECT_POSITION,
                opacity: front === 1 ? 1 : 0,
                transition: `opacity ${CROSSFADE_S * 1000}ms linear`,
              }}
            />
          )}
        </div>

        <Scrim portrait={portrait} />

        {/* Overlay: spans the viewport; 1 SVG unit == 1 CSS px. */}
        {geom && (
          <svg
            viewBox={`0 0 ${geom.vw} ${geom.vh}`}
            width="100%"
            height="100%"
            className="pointer-events-none absolute inset-0 text-[var(--accent)]"
            aria-hidden="true"
          >
            {arrow && <HeroArrow {...arrow} />}
            <FigureGlow
              box={geom.box}
              ax={geom.ax}
              ay={geom.ay}
              active={glowActive}
              pulse={glowPulse}
              canHover={canHover}
              hitScale={portrait ? PORTRAIT_HIT_SCALE : 1}
              onActivate={activateGlow}
              onDeactivate={deactivateGlow}
            />
          </svg>
        )}

        {/* Text block: real, selectable, indexable HTML — the page's h1. */}
        {/* Outer wrapper: static positioning (and what the arrow aims at);
            inner div carries the entrance animation so the measurement
            isn't skewed by the transform. */}
        <div
          ref={textRef}
          className="absolute z-10 max-w-[80vw] md:max-w-[40rem]"
          style={textPos}
        >
          <div
            className="hero-anim"
            style={{
              opacity: 0,
              transform: `translateY(${TEXT_SLIDE_PX}px)`,
              animation: `hero-rise-in ${TEXT_ENTER_MS}ms ease-out ${TEXT_ENTER_DELAY_MS}ms forwards`,
            }}
          >
          <p className="mb-3 text-base tracking-[0.08em] text-[var(--accent-soft)] md:text-xl">
            Hello, I&apos;m
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--accent)] md:text-6xl lg:text-7xl">
            Ali Nebi Dal
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--accent-soft)] md:text-lg">
            Entrepreneur &amp; GTM Specialist
          </p>
          <div className="mt-5 flex flex-col items-start gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm text-base text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] md:text-lg"
            >
              <Linkedin className="size-5" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-sm text-base text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] md:text-lg"
            >
              <Mail className="size-5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>
          </div>
        </div>

        {/* Veil: covers the video if scroll content is ever re-enabled. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[var(--bg)] transition-opacity duration-200 ease-linear"
          style={{ opacity: veil }}
        />

        {calibrate && geom && (
          <Calibrator rowW={geom.vw} rowH={geom.vh} box={geom.box} />
        )}
      </div>

      {/* Scroll indicator: in-flow sibling of the fixed stage, so it scrolls
          away with the hero. The bob animation lives on the icon, not the
          anchor, so it doesn't fight the centering transform. */}
      <a
        href="#ventures"
        aria-label="Scroll to Ventures"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/60 transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <ChevronDown className="hero-bob size-6" aria-hidden="true" />
      </a>
    </section>
  );
}
