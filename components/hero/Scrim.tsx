import {
  GRAIN_OPACITY,
  SCRIM_BOTTOM_GRADIENT,
  SCRIM_BOTTOM_GRADIENT_PORTRAIT,
  SCRIM_SIDE_GRADIENT,
} from "./hero.constants";

/**
 * The two gradient scrims plus the grain layer. Mandatory, not decorative:
 * yellow text over the frame's lit regions measures 1.24:1–1.83:1, and the
 * cover crop changes per viewport so no fixed text position is safe without
 * them. Deliberately NOT a flat overlay — that would kill the pendant-light
 * mood. The grain masks H.264 banding in the upscaled flat dark areas.
 */
export function Scrim({ portrait }: { portrait: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: SCRIM_SIDE_GRADIENT }} />
      <div
        className="absolute inset-0"
        style={{
          background: portrait ? SCRIM_BOTTOM_GRADIENT_PORTRAIT : SCRIM_BOTTOM_GRADIENT,
        }}
      />
      <div
        className="noise-overlay absolute inset-0"
        style={{ opacity: GRAIN_OPACITY, mixBlendMode: "overlay" }}
      />
    </div>
  );
}
