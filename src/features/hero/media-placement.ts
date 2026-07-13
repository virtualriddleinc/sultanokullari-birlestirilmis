import {
  CONTAINER_ASPECT_RATIO,
  HEXAGON_ASPECT_RATIO,
  HEXAGON_CLIP_HEIGHT_PCT,
  HEXAGON_CLIP_WIDTH_PCT,
} from "./geometry";

export type FocalPoint = { x: number; y: number };

export type MediaPlacementInput = {
  mediaAspect?: number | null;
  mediaScale?: number | null;
  focalPoint?: FocalPoint | null;
};

export type MediaPlacement = {
  /** Absolute wrapper that positions the media inside the hex hole */
  wrapperStyle: {
    position: "absolute";
    width: string;
    height: string;
    left: string;
    top: string;
  };
  /** Reticle size as % of the source media (admin picker) */
  reticleWPct: number;
  reticleHPct: number;
  mediaAspect: number;
  mediaScale: number;
  focalPoint: FocalPoint;
};

/** Frame overlay size relative to the hex hole reticle */
export const FRAME_OVER_RETICLE_WIDTH_PCT =
  100 / (HEXAGON_CLIP_WIDTH_PCT / 100);
export const FRAME_OVER_RETICLE_HEIGHT_PCT =
  100 / (HEXAGON_CLIP_HEIGHT_PCT / 100);

/**
 * Hex-aware media placement — shared by admin focal picker and site render.
 * Matches the slider-gelistirmesi wrapper-offset formula against site geometry.
 */
export function computeMediaPlacement(
  input: MediaPlacementInput = {},
): MediaPlacement {
  const mediaAspect = input.mediaAspect || CONTAINER_ASPECT_RATIO;
  const mediaScale = input.mediaScale || 1;
  const focalPoint: FocalPoint = {
    x: input.focalPoint?.x ?? 50,
    y: input.focalPoint?.y ?? 50,
  };

  const Rc = HEXAGON_ASPECT_RATIO;
  let w = 100;
  let h = 100;
  if (mediaAspect > Rc) {
    w = (Rc / mediaAspect) * 100;
  } else {
    h = (mediaAspect / Rc) * 100;
  }

  const reticleWPct = w / mediaScale;
  const reticleHPct = h / mediaScale;
  const { x: fX, y: fY } = focalPoint;

  const wrapperStyle = {
    position: "absolute" as const,
    width: `${100 / (reticleWPct / 100)}%`,
    height: `${100 / (reticleHPct / 100)}%`,
    left: `${(-(fX - reticleWPct / 2) / reticleWPct) * 100}%`,
    top: `${(-(fY - reticleHPct / 2) / reticleHPct) * 100}%`,
  };

  return {
    wrapperStyle,
    reticleWPct,
    reticleHPct,
    mediaAspect,
    mediaScale,
    focalPoint,
  };
}

/** Clamp focal so the reticle stays inside the source media bounds */
export function clampFocalPoint(
  xPct: number,
  yPct: number,
  reticleWPct: number,
  reticleHPct: number,
): FocalPoint {
  const halfW = reticleWPct / 2;
  const halfH = reticleHPct / 2;
  return {
    x: Math.round(Math.max(halfW, Math.min(100 - halfW, xPct))),
    y: Math.round(Math.max(halfH, Math.min(100 - halfH, yPct))),
  };
}
