"use client";

import {
  ARROW_CORNER_RADIUS_PX,
  ARROW_DELAY_MS,
  ARROW_DRAW_MS,
  ARROW_EASE,
  ARROW_ERASE_MS,
  ARROW_GLOW_BLUR_PX,
  ARROW_GLOW_OPACITY,
  ARROW_HEAD_SIZE_PX,
  ARROW_HOLD_MS,
  ARROW_OPACITY,
  ARROW_STROKE_PX,
} from "./hero.constants";

interface Pt {
  x: number;
  y: number;
}

/**
 * Route computed by HeroFullBleed from the measured text rect: an ordered
 * polyline (e.g. start → north corner → west corner → tip). Every interior
 * corner is rounded; the arrowhead points along the final leg.
 */
export interface ArrowRoute {
  points: Pt[];
}

function roundedPath(points: Pt[]): string {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const c = points[i];
    const next = points[i + 1];
    const lIn = Math.hypot(c.x - prev.x, c.y - prev.y) || 1;
    const lOut = Math.hypot(next.x - c.x, next.y - c.y) || 1;
    const r = Math.min(ARROW_CORNER_RADIUS_PX, lIn * 0.4, lOut * 0.4);
    const a = { x: c.x - ((c.x - prev.x) / lIn) * r, y: c.y - ((c.y - prev.y) / lIn) * r };
    const b = { x: c.x + ((next.x - c.x) / lOut) * r, y: c.y + ((next.y - c.y) / lOut) * r };
    d += ` L ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  }
  const end = points[points.length - 1];
  d += ` L ${end.x} ${end.y}`;
  return d;
}

/**
 * Drawn with a pathLength=1 dash reveal. The arrowhead is a separate path
 * that fades in after the line lands — marker-end would render it at the
 * path's geometric end before the dash reveal reaches it.
 */
export function HeroArrow({ points }: ArrowRoute) {
  const d = roundedPath(points);

  const end = points[points.length - 1];
  const beforeEnd = points[points.length - 2];
  const lLast = Math.hypot(end.x - beforeEnd.x, end.y - beforeEnd.y) || 1;
  const v = { x: (end.x - beforeEnd.x) / lLast, y: (end.y - beforeEnd.y) / lLast };

  const s = ARROW_HEAD_SIZE_PX;
  const base = { x: end.x - v.x * s, y: end.y - v.y * s };
  const perp = { x: -v.y, y: v.x };
  const head = `M ${base.x + perp.x * s * 0.66} ${base.y + perp.y * s * 0.66} L ${end.x} ${end.y} L ${base.x - perp.x * s * 0.66} ${base.y - perp.y * s * 0.66}`;

  const cycleMs = ARROW_DRAW_MS + ARROW_HOLD_MS + ARROW_ERASE_MS;
  const draw = {
    strokeDasharray: 1,
    strokeDashoffset: 1,
    animation: `hero-draw-through ${cycleMs}ms ${ARROW_EASE} ${ARROW_DELAY_MS}ms forwards`,
  } as const;

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* soft duplicate underneath so the line reads against the scene */}
      <path
        d={d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={ARROW_STROKE_PX + 1}
        opacity={ARROW_GLOW_OPACITY}
        style={{ ...draw, filter: `blur(${ARROW_GLOW_BLUR_PX}px)` }}
        className="hero-anim"
      />
      <path
        d={d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={ARROW_STROKE_PX}
        opacity={ARROW_OPACITY}
        style={draw}
        className="hero-anim"
      />
      <path
        d={head}
        stroke="currentColor"
        strokeWidth={ARROW_STROKE_PX}
        opacity={0}
        style={{
          animation: `hero-head-blink ${ARROW_HOLD_MS + ARROW_ERASE_MS}ms ease-out ${ARROW_DELAY_MS + ARROW_DRAW_MS}ms forwards`,
          ["--hero-fade-target" as string]: ARROW_OPACITY,
        }}
        className="hero-anim"
      />
    </g>
  );
}
