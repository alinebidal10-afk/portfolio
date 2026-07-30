"use client";

import { useSyncExternalStore } from "react";

/** A rect in viewport space; the cover-scaled video rect may have negative
 *  x/y and exceed the viewport — that's expected. */
export interface ElementBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEBOUNCE_MS = 100;

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const handler = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(onChange, DEBOUNCE_MS);
  };
  window.addEventListener("resize", handler);
  window.addEventListener("orientationchange", handler);
  return () => {
    if (timer) clearTimeout(timer);
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
  };
}

/**
 * Viewport size, debounced across resize/orientationchange.
 * Returns null on the server and before the first client render.
 */
export function useViewport(): { vw: number; vh: number } | null {
  const vw = useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 0,
  );
  const vh = useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => 0,
  );
  return vw > 0 && vh > 0 ? { vw, vh } : null;
}
