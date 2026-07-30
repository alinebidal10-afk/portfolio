// All tunables for the hero + scroll sections live here. Coordinate-space
// constants are normalized (to the viewport or the cover-scaled video)
// unless the name says PX.

// ---------------------------------------------------------------------------
// Asset facts (measured once — do not re-measure)
// ---------------------------------------------------------------------------
export const VIDEO_W = 1112;
export const VIDEO_H = 834;
/** Raw <video> src/poster don't get Next's basePath rewriting, so prefix
 *  them manually (GitHub Pages serves the site under /portfolio). */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const VIDEO_SRC = `${BASE_PATH}/hero/hero.mp4`;
export const POSTER_SRC = `${BASE_PATH}/hero/poster.jpg`;
/** Fallback if metadata hasn't loaded yet when the loop logic first runs. */
export const VIDEO_DURATION_S = 10.04;

// ---------------------------------------------------------------------------
// The figure (calibrate with ?calibrate=1 in dev)
// ---------------------------------------------------------------------------
/**
 * Normalized to the video frame. Also drives the video's object-position,
 * which is what pins the figure to (FIGURE.x * vw, FIGURE.y * vh) on every
 * viewport — see the comment at the top of HeroFullBleed.tsx.
 */
export const FIGURE = { x: 0.56, y: 0.43 };

/**
 * Optional traced outline of the figure, authored in the video's native
 * 1112x834 pixel space. When non-null, FigureGlow renders the tier-2
 * silhouette bloom instead of the tier-1 gradient blob.
 */
export const FIGURE_SILHOUETTE_PATH: string | null = null;

export const LINKEDIN_URL = "https://www.linkedin.com/in/ali-nebi-dal-995420351/";
export const INSTAGRAM_URL = "https://www.instagram.com/ali.dal__/";
export const CONTACT_EMAIL = "alinebidal10@gmail.com";

/** Two stacked videos cross-fading at the wrap point (the clip's first and
 *  last frames don't match, so a plain `loop` shows a visible cut). */
export const CROSSFADE_LOOP = true;
export const CROSSFADE_S = 0.8;

// ---------------------------------------------------------------------------
// Layout — the text block sits middle-left (vertically centred on desktop,
// lower-left in portrait where centred text would cover the figure). The
// arrow starts just above the figure's HEAD, runs horizontally toward the
// text, makes its single turn, and drops down to point at the name.
// ---------------------------------------------------------------------------
export const TEXT_LEFT_FRACTION = 0.08; // desktop text left edge, of vw
export const PORTRAIT_MAX_WIDTH_PX = 768;
export const PORTRAIT_TEXT_LEFT_PX = 24;
export const PORTRAIT_TEXT_TOP_FRACTION = 0.55; // below the figure
export const PORTRAIT_HIT_SCALE = 1.4; // fingers are imprecise

/** How far above the anchor (chest) the arrow starts, as a fraction of
 *  the DISPLAYED video height so it tracks the figure's rendered size.
 *  0.09 ≈ just above the top of the head with a small gap. */
export const ARROW_LIFT_FRACTION = 0.09;
/** the down-pointing tip stops this far above the text block */
export const ARROW_TIP_GAP_PX = 12;
/** horizontal offset of the start from the figure's centre (fraction of
 *  the displayed video width). 0 = the arrow rises straight off the head. */
export const ARROW_START_SHIFT_FRACTION = 0;
/** the west leg of the north→west→south route passes this far above both
 *  the start point and the text block */
export const ARROW_RISE_CLEARANCE_PX = 64;

// ---------------------------------------------------------------------------
// Arrow stroke + animation
// ---------------------------------------------------------------------------
export const ARROW_CORNER_RADIUS_PX = 18;
export const ARROW_STROKE_PX = 3;
export const ARROW_OPACITY = 1;
export const ARROW_HEAD_SIZE_PX = 12;
/** the blurred duplicate that makes the arrow glow over the bright frame */
export const ARROW_GLOW_BLUR_PX = 7;
export const ARROW_GLOW_OPACITY = 0.6;

// The arrow draws in, holds a beat, then erases tail-first from its start
// (the line "flows" into the text and vanishes). If you change this split,
// update the hero-draw-through / hero-head-blink keyframe percentages in
// globals.css to match.
export const ARROW_DRAW_MS = 900;
export const ARROW_HOLD_MS = 400;
export const ARROW_ERASE_MS = 700;
export const ARROW_DELAY_MS = 350;
export const ARROW_EASE = "cubic-bezier(.22,1,.36,1)";

// ---------------------------------------------------------------------------
// Text block
// ---------------------------------------------------------------------------
export const TEXT_ENTER_DELAY_MS = 1150; // lands right as the arrow finishes
export const TEXT_ENTER_MS = 500;
export const TEXT_SLIDE_PX = 8;

// ---------------------------------------------------------------------------
// Scrim + grain (mandatory: yellow over the lit regions of the frame is
// 1.24:1–1.83:1 without it)
// ---------------------------------------------------------------------------
/** Dark side sits under the TEXT side — left on desktop now that the
 *  arrow runs up-then-LEFT; the right side stays untouched per the user. */
export const SCRIM_SIDE_GRADIENT =
  "linear-gradient(to right, rgba(8,10,12,.86) 0%, rgba(8,10,12,.55) 45%, transparent 72%)";
export const SCRIM_BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(8,10,12,.9), transparent 45%)";
/** portrait text sits lower, so the bottom scrim starts higher */
export const SCRIM_BOTTOM_GRADIENT_PORTRAIT =
  "linear-gradient(to top, rgba(8,10,12,.9), transparent 65%)";
/** masks H.264 banding in the upscaled flat dark areas */
export const GRAIN_OPACITY = 0.035;

// ---------------------------------------------------------------------------
// Glow — tier 1 (gradient blob) and hit region. Fractions of the
// cover-scaled video width/height so they track the figure's rendered size.
// ---------------------------------------------------------------------------
export const HIT_RX_FRACTION = 0.045;
export const HIT_RY_FRACTION = 0.1;
export const GLOW_FADE_MS = 260;
export const GLOW_INNER_R_FRACTION = 0.055;
export const GLOW_OUTER_R_FRACTION = 0.16;
/** brightness/saturate beat on the video itself while hovering the figure */
export const VIDEO_POP_MS = 500;
/** one-shot pulse length on touch devices when the hero scrolls into view */
export const TOUCH_PULSE_MS = 1200;

// ---------------------------------------------------------------------------
// Glow — tier 2 (silhouette bloom)
// ---------------------------------------------------------------------------
export const SILHOUETTE_BLOOM_STROKE_PX = 6;
export const SILHOUETTE_BLOOM_BLUR = 8; // feGaussianBlur stdDeviation, keep >= 6
export const SILHOUETTE_RIM_STROKE_PX = 1.25;
export const SILHOUETTE_RIM_OPACITY = 0.9;

// ---------------------------------------------------------------------------
// Scroll behaviour
// ---------------------------------------------------------------------------
/** pause the video once the hero is less visible than this */
export const HERO_PAUSE_VISIBILITY = 0.1;
/** the scroll cue hides once the user has scrolled past this many svh */
export const CUE_HIDE_SVH = 5;
/** section reveal stagger per child (duration/offset live in globals.css) */
export const REVEAL_STAGGER_MS = 60;
export const REVEAL_ROOT_MARGIN = "0px 0px -15% 0px";
