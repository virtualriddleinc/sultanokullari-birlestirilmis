"use client";

import React from "react";
import { useField, useFormFields } from "@payloadcms/ui";
import cerceveFrame from "@/images/cini-cerceve.png";
import {
  CONTAINER_ASPECT_RATIO,
  HEXAGON_ASPECT_RATIO,
  HEX_CLIP_PATH,
  HEX_HOLE_CLIP_PATH,
  HEX_MEDIA_COVER_SCALE,
} from "@/features/hero/geometry";
import {
  clampFocalPoint,
  computeMediaPlacement,
  FRAME_OVER_RETICLE_WIDTH_PCT,
} from "@/features/hero/media-placement";

type MediaUploadValue =
  | number
  | { id?: number; url?: string | null; filename?: string | null }
  | null
  | undefined;

function resolveUploadUrl(media: MediaUploadValue): string | null {
  if (!media || typeof media === "number") return null;
  if (media.url) return media.url;
  if (media.filename) return `/api/media/file/${media.filename}`;
  return null;
}

function resolveUploadId(media: MediaUploadValue): number | null {
  if (typeof media === "number") return media;
  if (media && typeof media === "object" && typeof media.id === "number") {
    return media.id;
  }
  return null;
}

export default function HexFocalPointPicker() {
  const slideMediaSrc = useFormFields(
    ([fields]) => fields["slideMedia.src"]?.value as string | null | undefined,
  );
  const slideMediaKind = useFormFields(
    ([fields]) =>
      fields["slideMedia.kind"]?.value as "image" | "video" | null | undefined,
  );
  const slideMediaUpload = useFormFields(
    ([fields]) => fields["slideMedia.media"]?.value as MediaUploadValue,
  );

  const { value: focalX, setValue: setFocalXRaw } = useField<number>({
    path: "focalPoint.x",
  });
  const { value: focalY, setValue: setFocalYRaw } = useField<number>({
    path: "focalPoint.y",
  });
  const { value: mediaScale, setValue: setMediaScaleRaw } = useField<number>({
    path: "mediaScale",
  });
  const { value: mediaAspect, setValue: setMediaAspectRaw } = useField<number>({
    path: "mediaAspect",
  });

  // Explicitly mark form dirty so Save persists focal/scale (Payload setValue 2nd arg)
  const setFocalX = React.useCallback(
    (v: number) => setFocalXRaw(Number(v.toFixed(2)), false),
    [setFocalXRaw],
  );
  const setFocalY = React.useCallback(
    (v: number) => setFocalYRaw(Number(v.toFixed(2)), false),
    [setFocalYRaw],
  );
  const setMediaScale = React.useCallback(
    (v: number) => setMediaScaleRaw(Number(v.toFixed(2)), false),
    [setMediaScaleRaw],
  );
  const setMediaAspect = React.useCallback(
    (v: number) => setMediaAspectRaw(v, false),
    [setMediaAspectRaw],
  );

  const [resolvedUrl, setResolvedUrl] = React.useState<string | null>(null);
  const [localAspect, setLocalAspect] = React.useState(
    mediaAspect || CONTAINER_ASPECT_RATIO,
  );

  const mediaKind = slideMediaKind === "video" ? "video" : "image";
  const scale = mediaScale || 1;
  const fX = typeof focalX === "number" ? focalX : 50;
  const fY = typeof focalY === "number" ? focalY : 50;

  React.useEffect(() => {
    if (slideMediaSrc) {
      setResolvedUrl(slideMediaSrc);
      return;
    }

    const direct = resolveUploadUrl(slideMediaUpload);
    if (direct) {
      setResolvedUrl(direct);
      return;
    }

    const id = resolveUploadId(slideMediaUpload);
    if (!id) {
      setResolvedUrl(null);
      return;
    }

    let cancelled = false;
    void fetch(`/api/media/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: { url?: string; filename?: string } | null) => {
        if (cancelled || !doc) return;
        const url =
          doc.url || (doc.filename ? `/api/media/file/${doc.filename}` : null);
        setResolvedUrl(url);
      })
      .catch(() => {
        if (!cancelled) setResolvedUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slideMediaSrc, slideMediaUpload]);

  React.useEffect(() => {
    if (typeof mediaAspect === "number" && mediaAspect > 0) {
      setLocalAspect(mediaAspect);
    }
  }, [mediaAspect]);

  const placement = React.useMemo(
    () =>
      computeMediaPlacement({
        mediaAspect: localAspect,
        mediaScale: scale,
        focalPoint: { x: fX, y: fY },
      }),
    [localAspect, scale, fX, fY],
  );

  // Scale değişince odak reticle sınırları içinde kalsın (sonsuz döngüyü önle)
  React.useEffect(() => {
    const clamped = clampFocalPoint(
      fX,
      fY,
      placement.reticleWPct,
      placement.reticleHPct,
    );
    if (Math.abs(clamped.x - fX) > 0.01) setFocalX(clamped.x);
    if (Math.abs(clamped.y - fY) > 0.01) setFocalY(clamped.y);
    // Yalnızca reticle boyutu değişince yeniden hizala
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fX/fY kasıtlı dışarıda
  }, [placement.reticleWPct, placement.reticleHPct, setFocalX, setFocalY]);

  const handleMediaLoad = (
    e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>,
  ) => {
    const target = e.currentTarget;
    let aspect = CONTAINER_ASPECT_RATIO;
    if ("naturalWidth" in target && target.naturalHeight) {
      aspect = target.naturalWidth / target.naturalHeight;
    } else if ("videoWidth" in target && target.videoHeight) {
      aspect = target.videoWidth / target.videoHeight;
    }
    setLocalAspect(aspect);
    if (mediaAspect !== aspect) {
      setMediaAspect(aspect);
    }
  };

  const updateFocalFromPointer = (
    clientX: number,
    clientY: number,
    rect: DOMRect,
  ) => {
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    const clamped = clampFocalPoint(
      xPct,
      yPct,
      placement.reticleWPct,
      placement.reticleHPct,
    );
    setFocalX(clamped.x);
    setFocalY(clamped.y);
  };

  const frameSrc =
    typeof cerceveFrame === "string"
      ? cerceveFrame
      : (cerceveFrame as { src: string }).src;

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: 8,
        background: "var(--theme-elevation-50)",
      }}
    >
      <div style={{ marginBottom: "0.75rem" }}>
        <strong style={{ display: "block", marginBottom: 4 }}>
          Canlı Odak Noktası
        </strong>
      </div>

      {resolvedUrl ? (
        <div
          style={{
            marginBottom: "1rem",
            maxWidth: 280,
            marginInline: "auto",
            position: "relative",
            overflow: "hidden",
            aspectRatio: `${CONTAINER_ASPECT_RATIO}`,
            background: "#111",
            borderRadius: 8,
            border: "1px solid var(--theme-elevation-150)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              overflow: "hidden",
              clipPath: HEX_CLIP_PATH,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transform: `scale(${HEX_MEDIA_COVER_SCALE})`,
                transformOrigin: "center",
                overflow: "hidden",
              }}
            >
              <div style={placement.wrapperStyle}>
                {mediaKind === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={resolvedUrl}
                    muted
                    playsInline
                    autoPlay
                    loop
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvedUrl}
                    alt="Önizleme"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameSrc}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          width: "100%",
          background: "var(--theme-elevation-100)",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          border: "1px solid var(--theme-elevation-150)",
        }}
      >
        {resolvedUrl ? (
          <div
            style={{
              position: "relative",
              cursor: "crosshair",
              touchAction: "none",
              background: "#000",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              updateFocalFromPointer(e.clientX, e.clientY, rect);

              const onMove = (ev: PointerEvent) => {
                updateFocalFromPointer(ev.clientX, ev.clientY, rect);
              };
              const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
              };
              window.addEventListener("pointermove", onMove);
              window.addEventListener("pointerup", onUp);
            }}
          >
            {mediaKind === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={resolvedUrl}
                muted
                playsInline
                onLoadedMetadata={handleMediaLoad}
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  width: "auto",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none",
                  opacity: 0.85,
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedUrl}
                alt="Odak noktası seçimi"
                onLoad={handleMediaLoad}
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  width: "auto",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none",
                  opacity: 0.85,
                }}
              />
            )}

            {/*
              Reticle: width % of image + fixed hex aspect-ratio.
              height:% is unreliable on abspos parents sized by <img>, and
              stretched the frame vertically — match top preview proportions.
            */}
            <div
              style={{
                position: "absolute",
                left: `${fX}%`,
                top: `${fY}%`,
                width: `${placement.reticleWPct}%`,
                aspectRatio: `${HEXAGON_ASPECT_RATIO}`,
                height: "auto",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: HEX_HOLE_CLIP_PATH,
                  background: "#3df516",
                  opacity: 0.95,
                  filter: "drop-shadow(0 0 6px rgba(0,0,0,0.9))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 2.5,
                  clipPath: HEX_HOLE_CLIP_PATH,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frameSrc}
                alt=""
                aria-hidden
                style={{
                  position: "absolute",
                  width: `${FRAME_OVER_RETICLE_WIDTH_PCT}%`,
                  aspectRatio: `${CONTAINER_ASPECT_RATIO}`,
                  height: "auto",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  objectFit: "contain",
                  opacity: 0.75,
                  pointerEvents: "none",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#3df516",
                  zIndex: 2,
                  boxShadow: "0 0 3px rgba(0,0,0,1)",
                }}
              />
            </div>
          </div>
        ) : (
          <span style={{ color: "var(--theme-elevation-600)", fontSize: 14 }}>
            Önce bir görsel veya video ekleyin
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontSize: 12,
          color: "var(--theme-elevation-700)",
          fontWeight: 500,
        }}
      >
        <span>X: {fX}%</span>
        <span>Y: {fY}%</span>
        <span>Yakınlaştırma: {scale}x</span>
      </div>

      <div style={{ marginTop: 16 }}>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Görsel yakınlaştırma (Scale)
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6 }}>1x</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={scale}
            onChange={(e) => setMediaScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: "#3df516" }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6 }}>3x</span>
        </div>
      </div>
    </div>
  );
}
