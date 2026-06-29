"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { X } from "lucide-react";
import { submitContact, type ContactFormState } from "@/app/(site)/iletisim/actions";

const initial: ContactFormState = { ok: false, message: "" };

const STORAGE_KEY = "sultan-info-request-dismissed";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, o: { action: string }) => Promise<string>;
    };
  }
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";

export type InfoRequestModalProps = {
  enabled?: boolean;
  brandLabel?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  dismissLabel?: string;
  kvkkText?: string;
};

export function InfoRequestModal({
  enabled = true,
  brandLabel = "Sultan Okulları",
  title = "Sizi Arayalım!",
  subtitle = "Numaranızı bırakın, eğitim danışmanımız en kısa sürede sizi arayıp tüm sorularınızı yanıtlasın.",
  submitLabel = "Beni Arayın",
  dismissLabel = "Şimdi değil",
  kvkkText = "KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesini, tarafıma arama yapılmasını ve SMS gönderilmesini kabul ediyorum.",
}: InfoRequestModalProps = {}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    let shouldShow = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = Number.parseInt(raw, 10);
        if (Number.isFinite(ts) && Date.now() - ts < DISMISS_TTL_MS) {
          shouldShow = false;
        }
      }
    } catch {}
    if (shouldShow) {
      const id = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(id);
    }
  }, [enabled]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  useEffect(() => {
    if (state.ok && formRef.current) formRef.current.reset();
  }, [state.ok]);

  async function onSubmit(formData: FormData) {
    if (siteKey && typeof window !== "undefined" && window.grecaptcha) {
      await new Promise<void>((resolve) => window.grecaptcha!.ready(resolve));
      const token = await window.grecaptcha.execute(siteKey, {
        action: "info_request",
      });
      formData.set("recaptchaToken", token);
    }
    return formAction(formData);
  }

  function handleNameInput(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    input.value = input.value.replace(
      /[^A-Za-zCÇGĞIİOÖSŞUÜa-zcçgğiıoösşuü\s'-]/g,
      "",
    );
  }

  function handlePhoneInput(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D/g, "").slice(0, 11);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="info-modal"
          className="fixed inset-0 z-[100]"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="info-request-title"
        >
          {/* Backdrop: Tüm ekranı kaplar */}
          <button
            type="button"
            aria-label="Pop-up'ı kapat"
            onClick={close}
            className="absolute inset-0 cursor-default bg-zinc-950/55 backdrop-blur-sm"
          />

          {/* Modal content alanı: logonun alt yayından ekranın altına kadar, ortada */}
          <div className="absolute inset-x-0 top-[calc(var(--header-height)+var(--hero-top-spacer,107px))] bottom-0 flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
            <motion.div
              ref={dialogRef}
              className="relative z-[1] max-h-full w-full max-w-xl overflow-y-auto rounded-3xl border border-emerald-900/15 bg-white shadow-[0_40px_140px_rgba(7,32,17,0.35)]"
              initial={
                reduce ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              <div className="relative bg-[#fff085] px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Kapat"
                  className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-emerald-900/15 bg-white/80 text-emerald-950 transition hover:bg-white"
                >
                  <X className="size-4" />
                </button>
                <p className="text-xs font-semibold tracking-[0.32em] text-emerald-900/70 uppercase">
                  {brandLabel}
                </p>
                <h2
                  id="info-request-title"
                  className="mt-2 text-3xl leading-tight font-bold tracking-tight text-emerald-950 sm:text-4xl"
                >
                  {title}
                </h2>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-emerald-950/75">
                  {subtitle}
                </p>
              </div>

              <div className="px-6 pt-6 pb-7 sm:px-8 sm:pb-8">
                {state.message ? (
                  <p
                    className={`mb-5 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}
                    role="status"
                  >
                    {state.message}
                  </p>
                ) : null}

                {state.ok ? (
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(13,107,42,0.25)] transition hover:bg-[var(--color-primary-dark)]"
                  >
                    Kapat
                  </button>
                ) : (
                  <form ref={formRef} action={onSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden
                    />
                    <input
                      type="hidden"
                      name="source"
                      value="info_request"
                    />
                    <input
                      type="hidden"
                      name="subject"
                      value="Sizi Arayalım (Pop-up)"
                    />
                    <input
                      type="hidden"
                      name="email"
                      value="belirtilmedi@sultan.edu.tr"
                    />
                    <input
                      type="hidden"
                      name="message"
                      value="Pop-up arama talebi."
                    />

                    <label className="block text-sm font-medium text-zinc-800">
                      Ad Soyad
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Adınız Soyadınız"
                        className={inputClass}
                        maxLength={100}
                        pattern="[A-Za-zCÇGĞIİOÖSŞUÜa-zcçgğiıoösşuü\s'-]+"
                        title="Lütfen yalnızca metin girin."
                        onInput={handleNameInput}
                      />
                      <FieldError errors={state.fieldErrors?.name} />
                    </label>

                    <label className="block text-sm font-medium text-zinc-800">
                      Telefon Numarası
                      <input
                        name="phone"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        placeholder="05XXXXXXXXX"
                        className={inputClass}
                        maxLength={11}
                        pattern="05[0-9]{9}"
                        title="Telefon numarasını 05XXXXXXXXX formatında girin."
                        onInput={handlePhoneInput}
                      />
                      <FieldError errors={state.fieldErrors?.phone} />
                    </label>

                    <label className="flex items-start gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-600">
                      <input
                        name="kvkk"
                        type="checkbox"
                        value="on"
                        required
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-[var(--color-primary)]"
                      />
                      <span>
                        <a
                          href="/kvkk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          KVKK aydınlatma metnini
                        </a>{" "}
                        {kvkkText.replace(/^KVKK aydınlatma metnini\s*/i, "")}
                      </span>
                    </label>
                    <FieldError errors={state.fieldErrors?.kvkk} />

                    <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                      <button
                        type="button"
                        onClick={close}
                        className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                      >
                        {dismissLabel}
                      </button>
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(13,107,42,0.25)] transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
                      >
                        {pending ? "Gönderiliyor…" : submitLabel}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="mt-1 block text-xs text-red-600">{errors[0]}</span>;
}
