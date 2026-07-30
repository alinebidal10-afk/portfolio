"use client";

import { useId } from "react";
import type { ElementBox } from "./useViewport";
import {
  FIGURE_SILHOUETTE_PATH,
  GLOW_FADE_MS,
  GLOW_INNER_R_FRACTION,
  GLOW_OUTER_R_FRACTION,
  HIT_RX_FRACTION,
  HIT_RY_FRACTION,
  LINKEDIN_URL,
  SILHOUETTE_BLOOM_BLUR,
  SILHOUETTE_BLOOM_STROKE_PX,
  SILHOUETTE_RIM_OPACITY,
  SILHOUETTE_RIM_STROKE_PX,
  TOUCH_PULSE_MS,
  VIDEO_H,
  VIDEO_W,
} from "./hero.constants";

interface FigureGlowProps {
  /** cover-scaled video rect in viewport space (may extend off-screen) */
  box: ElementBox;
  /** anchor in viewport px */
  ax: number;
  ay: number;
  active: boolean;
  /** one-shot pulse for touch devices (no hover) */
  pulse: boolean;
  /** false on touch devices — hit region becomes a LinkedIn link */
  canHover: boolean;
  /** widens the hit ellipse (1.4x in portrait — fingers are imprecise) */
  hitScale?: number;
  onActivate: () => void;
  onDeactivate: () => void;
}

/**
 * Glow + hit region for the figure in the video. Tier 2 (traced silhouette
 * bloom) when FIGURE_SILHOUETTE_PATH is set; tier 1 (stacked radial
 * gradients) otherwise. The video has no alpha channel, so this overlay is
 * the only way to make the glow track the figure instead of the video rect.
 */
export function FigureGlow({
  box,
  ax,
  ay,
  active,
  pulse,
  canHover,
  hitScale = 1,
  onActivate,
  onDeactivate,
}: FigureGlowProps) {
  const uid = useId();
  const innerId = `hero-glow-inner-${uid}`;
  const outerId = `hero-glow-outer-${uid}`;
  const bloomId = `hero-bloom-${uid}`;

  const glowStyle: React.CSSProperties = pulse
    ? { animation: `hero-glow-pulse ${TOUCH_PULSE_MS}ms ease-in-out forwards` }
    : { opacity: active ? 1 : 0, transition: `opacity ${GLOW_FADE_MS}ms ease-out` };

  const hitProps = canHover
    ? ({
        tabIndex: 0,
        role: "button",
        "aria-label": "Highlight Ali in the scene",
        onPointerEnter: onActivate,
        onPointerLeave: onDeactivate,
        onFocus: onActivate,
        onBlur: onDeactivate,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        },
      } as const)
    : ({ "aria-label": "Ali Nebi Dal on LinkedIn" } as const);

  // Tier 2: traced outline authored in the video's native 1112x834 space,
  // mapped into row space. The bloom is deliberately soft — the figure
  // gestures during the clip, so a sharp outline would visibly drift.
  if (FIGURE_SILHOUETTE_PATH !== null) {
    const silhouette = (
      <g
        transform={`translate(${box.x} ${box.y}) scale(${box.w / VIDEO_W} ${box.h / VIDEO_H})`}
        fill="none"
      >
        <g style={glowStyle}>
          <path
            d={FIGURE_SILHOUETTE_PATH}
            stroke="#cfe8ff"
            strokeWidth={SILHOUETTE_BLOOM_STROKE_PX}
            filter={`url(#${bloomId})`}
            style={{ mixBlendMode: "screen" }}
          />
          <path
            d={FIGURE_SILHOUETTE_PATH}
            stroke="#e6f3ff"
            strokeWidth={SILHOUETTE_RIM_STROKE_PX}
            opacity={SILHOUETTE_RIM_OPACITY}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <path
          d={FIGURE_SILHOUETTE_PATH}
          fill="transparent"
          pointerEvents="all"
          className="hero-hit"
          {...hitProps}
        />
      </g>
    );

    return (
      <g>
        <defs>
          <filter id={bloomId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={SILHOUETTE_BLOOM_BLUR} />
          </filter>
        </defs>
        {canHover ? (
          silhouette
        ) : (
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            {silhouette}
          </a>
        )}
      </g>
    );
  }

  // Tier 1: stacked radial gradients — a tight core plus a wide falloff.
  const innerR = GLOW_INNER_R_FRACTION * box.w;
  const outerR = GLOW_OUTER_R_FRACTION * box.w;

  const hitEllipse = (
    <ellipse
      cx={ax}
      cy={ay}
      rx={HIT_RX_FRACTION * box.w * hitScale}
      ry={HIT_RY_FRACTION * box.h * hitScale}
      fill="transparent"
      pointerEvents="all"
      className="hero-hit"
      {...hitProps}
    />
  );

  return (
    <g>
      <defs>
        <radialGradient id={innerId} gradientUnits="userSpaceOnUse" cx={ax} cy={ay} r={innerR}>
          <stop offset="0%" stopColor="#dcedff" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#a8cfff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a8cfff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={outerId} gradientUnits="userSpaceOnUse" cx={ax} cy={ay} r={outerR}>
          <stop offset="0%" stopColor="#9ec7f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9ec7f7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g style={{ ...glowStyle, mixBlendMode: "screen" }}>
        <circle cx={ax} cy={ay} r={outerR} fill={`url(#${outerId})`} />
        <circle cx={ax} cy={ay} r={innerR} fill={`url(#${innerId})`} />
      </g>
      {canHover ? (
        hitEllipse
      ) : (
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          {hitEllipse}
        </a>
      )}
    </g>
  );
}
