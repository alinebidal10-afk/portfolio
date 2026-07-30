"use client";

import { useCallback, useState } from "react";
import type { ElementBox } from "./useViewport";
import { FIGURE, HIT_RX_FRACTION, HIT_RY_FRACTION } from "./hero.constants";

interface CalibratorProps {
  /** viewport size in px */
  rowW: number;
  rowH: number;
  /** cover-scaled video rect in viewport space */
  box: ElementBox;
}

/**
 * Dev-only overlay (?calibrate=1) for dialing in FIGURE. Shows a cursor
 * crosshair, live normalized video coordinates, and the current tier-1 hit
 * ellipse; clicking copies a ready-to-paste FIGURE constant.
 */
export function Calibrator({ rowW, rowH, box }: CalibratorProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  const norm = pos
    ? { x: (pos.x - box.x) / box.w, y: (pos.y - box.y) / box.h }
    : null;

  const handleClick = () => {
    if (!norm) return;
    const snippet = `export const FIGURE = { x: ${norm.x.toFixed(3)}, y: ${norm.y.toFixed(3)} };`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const ax = box.x + FIGURE.x * box.w;
  const ay = box.y + FIGURE.y * box.h;

  return (
    <>
      <svg
        viewBox={`0 0 ${rowW} ${rowH}`}
        width="100%"
        height="100%"
        className="absolute inset-0 z-30 cursor-crosshair"
        onPointerMove={handleMove}
        onPointerLeave={() => setPos(null)}
        onClick={handleClick}
      >
        {/* current FIGURE anchor + tier-1 hit ellipse */}
        <ellipse
          cx={ax}
          cy={ay}
          rx={HIT_RX_FRACTION * box.w}
          ry={HIT_RY_FRACTION * box.h}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <circle cx={ax} cy={ay} r={3} fill="#22d3ee" />
        {pos && (
          <g stroke="#f0abfc" strokeWidth={1}>
            <line x1={pos.x} y1={0} x2={pos.x} y2={rowH} />
            <line x1={0} y1={pos.y} x2={rowW} y2={pos.y} />
          </g>
        )}
      </svg>
      <div className="fixed bottom-4 left-4 z-50 rounded-md bg-black/80 px-3 py-2 font-mono text-xs text-cyan-300">
        {copied
          ? "copied FIGURE to clipboard"
          : norm
            ? `(${norm.x.toFixed(3)}, ${norm.y.toFixed(3)}) — click to copy`
            : "move cursor over the hero"}
      </div>
    </>
  );
}
