"use client";

import { useActionState, useEffect, useRef } from "react";
import type { Branch } from "@/content/branches";
import {
  branches as staticBranches,
  formatBranchLocation,
} from "@/content/branches";
import { submitContact, type ContactFormState } from "@/app/(site)/iletisim/actions";

const initial: ContactFormState = { ok: false, message: "" };

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, o: { action: string }) => Promise<string>;
    };
  }
}

export function ContactForm({
  defaultBranchSlug,
  branches = staticBranches,
}: {
  defaultBranchSlug?: string;
  branches?: Branch[];
}) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (state.ok && formRef.current) formRef.current.reset();
  }, [state.ok]);

  async function onSubmit(formData: FormData) {
    if (siteKey && typeof window !== "undefined" && window.grecaptcha) {
      await new Promise<void>((resolve) => window.grecaptcha!.ready(resolve));
      const token = await window.grecaptcha.execute(siteKey, {
        action: "contact",
      });
      formData.set("recaptchaToken", token);
    }
    return formAction(formData);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-zinc-200 bg-white/80 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-green/15 bg-white/85 p-6 shadow-[0_30px_120px_rgba(76,255,0,0.12)] backdrop-blur-md sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-green/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl"
      />

      {state.message ? (
        <p
          className={`relative mb-5 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-brand-green/20 text-charcoal" : "bg-red-50 text-red-900"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <form ref={formRef} action={onSubmit} className="relative space-y-5">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-800">
            Ad soyad
            <input name="name" required className={inputClass} />
            <FieldError errors={state.fieldErrors?.name} />
          </label>
          <label className="block text-sm font-medium text-zinc-800">
            E-posta
            <input name="email" type="email" required className={inputClass} />
            <FieldError errors={state.fieldErrors?.email} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-800">
            Telefon
            <input
              name="phone"
              inputMode="tel"
              required
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors?.phone} />
          </label>
          <label className="block text-sm font-medium text-zinc-800">
            Şube (isteğe bağlı)
            <select
              name="branchSlug"
              defaultValue={defaultBranchSlug ?? ""}
              className={`${inputClass} bg-white`}
            >
              <option value="">Seçiniz</option>
              {branches.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {formatBranchLocation(b)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-zinc-800">
          Konu
          <input name="subject" required className={inputClass} />
          <FieldError errors={state.fieldErrors?.subject} />
        </label>

        <label className="block text-sm font-medium text-zinc-800">
          Mesaj
          <textarea name="message" required rows={5} className={inputClass} />
          <FieldError errors={state.fieldErrors?.message} />
        </label>

        <label className="flex items-start gap-2.5 rounded-2xl border border-zinc-200 bg-white/60 p-3 text-sm text-zinc-700">
          <input
            name="kvkk"
            type="checkbox"
            value="on"
            required
            className="text-brand-green-ink mt-0.5 h-4 w-4 rounded border-zinc-300"
          />
          <span className="leading-6">
            <a
              href="/kvkk"
              className="text-brand-green-ink font-semibold hover:underline"
            >
              KVKK aydınlatma metnini
            </a>{" "}
            okudum, kişisel verilerimin işlenmesini kabul ediyorum.
          </span>
        </label>
        <FieldError errors={state.fieldErrors?.kvkk} />

        {siteKey ? (
          <p className="text-xs text-zinc-500">
            Bu site reCAPTCHA v3 ile korunur. Ana layout’ta Google script’i
            yüklendiğinde doğrulama çalışır. Sunucuda{" "}
            <code className="rounded bg-zinc-100 px-1">
              RECAPTCHA_SECRET_KEY
            </code>{" "}
            tanımlı olmalıdır.
          </p>
        ) : (
          <p className="text-xs text-zinc-500">
            Geliştirme:{" "}
            <code className="rounded bg-zinc-100 px-1">
              NEXT_PUBLIC_RECAPTCHA_SITE_KEY
            </code>{" "}
            yoksa captcha atlanır; üretimde her iki anahtarı da ayarlayın.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-brand-green text-charcoal hover:bg-charcoal hover:text-white inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(76,255,0,0.28)] transition hover:shadow-[0_22px_60px_rgba(26,28,24,0.25)] disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Gönderiliyor…" : "Mesajı gönder"}
        </button>
      </form>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="mt-1 block text-xs text-red-600">{errors[0]}</span>;
}
