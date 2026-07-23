"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import type { HexLandingModalContent } from "@/lib/hex-landing-modal";
import { HEX_LANDING_TRUST_NOTE } from "@/lib/hex-landing-modal";
import { cn } from "@/lib/cn";

export type HexLandingModalProps = {
  open: boolean;
  onClose: () => void;
  content: HexLandingModalContent | null;
};

function ModalMedia({ content }: { content: HexLandingModalContent }) {
  const { media, accentColor } = content;

  if (!media) {
    return (
      <div
        className="relative h-full w-full"
        style={{
          background: `linear-gradient(135deg, ${accentColor}55 0%, #0a0d12 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.12] mix-blend-multiply" />
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <AmbientSiteVideo
        src={media.src}
        poster={media.poster}
        title={media.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
    />
  );
}

function ModalCtaButton({
  cta,
  accentColor,
  variant,
  onClose,
}: {
  cta: NonNullable<HexLandingModalContent["primaryCta"]>;
  accentColor: string;
  variant: "primary" | "secondary";
  onClose: () => void;
}) {
  const className = cn(
    "flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-transform md:text-base",
    variant === "primary"
      ? "text-[#0a0d12] active:scale-95"
      : "border border-white/15 text-white/90 hover:bg-white/5 active:scale-[0.98]",
  );

  const style =
    variant === "primary" ? { backgroundColor: accentColor } : undefined;

  if (cta.href) {
    return (
      <Link
        href={cta.href}
        className={className}
        style={style}
        onClick={onClose}
      >
        {cta.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        cta.onClick?.();
        onClose();
      }}
    >
      {cta.label}
    </button>
  );
}

export function HexLandingModal({ open, onClose, content }: HexLandingModalProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus();
    }, reduce ? 0 : 120);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, handleClose, reduce]);

  if (typeof document === "undefined") return null;

  const backdropDuration = reduce ? 0 : 0.7;
  const panelDuration = reduce ? 0 : 1;

  return createPortal(
    <AnimatePresence>
      {open && content ? (
        <motion.div
          key="hex-landing-modal-root"
          className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
        >
          <motion.button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 backdrop-blur-3xl transition-[background-color]"
            style={{ backgroundColor: `${content.accentColor}33` }}
            initial={{ backdropFilter: reduce ? "blur(0px)" : "blur(0px)" }}
            animate={{ backdropFilter: reduce ? "blur(12px)" : "blur(48px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: backdropDuration }}
            onClick={handleClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative z-[1201] flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-[#0a0d12] text-white shadow-2xl outline-none md:flex-row md:rounded-[3.5rem]"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 80 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 40 }
            }
            transition={{
              duration: panelDuration,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:rotate-90 md:top-6 md:right-6"
              aria-label="Kapat"
            >
              <X size={20} aria-hidden />
            </button>

            {/* Medya — mobil üst %35, masaüstü sol %50 */}
            <div className="relative min-h-[35%] w-full shrink-0 md:min-h-0 md:w-1/2 md:max-w-[50%]">
              <div className="relative h-full min-h-[200px] w-full md:absolute md:inset-0 md:min-h-0">
                <ModalMedia content={content} />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-transparent to-transparent md:bg-gradient-to-r"
                  aria-hidden
                />
              </div>
            </div>

            {/* İçerik — mobil alt %65, masaüstü sağ %50 */}
            <div className="flex min-h-0 flex-1 flex-col md:w-1/2 md:max-w-[50%]">
              <div className="hex-landing-modal-scroll min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8 sm:py-10">
                <span className="mb-4 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-[0.4em] text-white/70 uppercase">
                  {content.eyebrow}
                </span>

                <h2
                  id={titleId}
                  className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl"
                >
                  {content.title}
                </h2>

                <p className="mt-5 text-base leading-relaxed text-slate-400 italic opacity-80 md:text-lg">
                  {content.description}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {content.trustNote ?? HEX_LANDING_TRUST_NOTE}
                </p>
              </div>

              {(content.primaryCta || content.secondaryCta) && (
                <div className="shrink-0 space-y-3 border-t border-white/5 px-6 py-5 sm:px-8 sm:py-6">
                  {content.primaryCta ? (
                    <ModalCtaButton
                      cta={content.primaryCta}
                      accentColor={content.accentColor}
                      variant="primary"
                      onClose={handleClose}
                    />
                  ) : null}
                  {content.secondaryCta ? (
                    <ModalCtaButton
                      cta={content.secondaryCta}
                      accentColor={content.accentColor}
                      variant="secondary"
                      onClose={handleClose}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
