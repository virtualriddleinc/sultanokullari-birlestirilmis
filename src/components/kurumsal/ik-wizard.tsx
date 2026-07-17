"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { transitionShort } from "@/lib/animations";
import type { Branch } from "@/content/branches";
import {
  branches as staticBranches,
  formatBranchLocation,
} from "@/content/branches";
import {
  submitIkApplication,
  type IkState,
} from "@/app/(site)/kurumsal/insan-kaynaklari/actions";

const initial: IkState = { ok: false, message: "" };

const steps = ["Kişisel bilgiler", "Mesleki bilgiler", "Ön yazı ve onay"] as const;

const labelClassName = "block text-sm font-semibold text-zinc-800";
const fieldClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, o: { action: string }) => Promise<string>;
    };
  }
}

type IkValues = {
  fullName: string;
  email: string;
  phone: string;
  branchSlug: string;
  position: string;
  experienceYears: string;
  education: string;
  coverLetter: string;
};

const emptyValues: IkValues = {
  fullName: "",
  email: "",
  phone: "",
  branchSlug: "",
  position: "",
  experienceYears: "0",
  education: "",
  coverLetter: "",
};

export function IkWizard({ branches = staticBranches }: { branches?: Branch[] }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<IkValues>(emptyValues);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [kvkk, setKvkk] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitIkApplication,
    initial,
  );
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Başarılı gönderimde formu sıfırla.
  useEffect(() => {
    if (state.ok) {
      setValues(emptyValues);
      setCvFile(null);
      setKvkk(false);
      setStep(0);
    }
  }, [state.ok]);

  function set<K extends keyof IkValues>(key: K) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Çok adımlı sihirbaz: alan değerleri React state'te tutulur; gönderimde
  // tüm adımların verileri tek bir FormData'ya toplanır (koşullu render
  // nedeniyle DOM'dan kalkan inputların kaybolmaması için).
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    (Object.keys(values) as (keyof IkValues)[]).forEach((key) => {
      formData.set(key, values[key]);
    });
    formData.set("kvkk", kvkk ? "on" : "");
    if (cvFile) formData.set("cv", cvFile);

    if (siteKey && typeof window !== "undefined" && window.grecaptcha) {
      await new Promise<void>((resolve) => window.grecaptcha!.ready(resolve));
      const token = await window.grecaptcha.execute(siteKey, {
        action: "ik_application",
      });
      formData.set("recaptchaToken", token);
    }
    // useActionState dispatch'i bir transition içinde çağrılmalı (await sonrası).
    startTransition(() => formAction(formData));
  }

  return (
    <div className="rounded-[2rem] border border-emerald-950/10 bg-white/95 p-5 shadow-[0_28px_90px_rgba(6,78,59,0.12)] backdrop-blur sm:p-7">
      <ol className="mb-7 grid gap-2 text-xs font-semibold text-zinc-500 sm:grid-cols-3">
        {steps.map((label, i) => (
          <li
            key={label}
            className={
              i === step
                ? "rounded-2xl bg-[var(--color-primary-light)] px-3 py-2 text-[var(--color-primary)]"
                : "rounded-2xl bg-zinc-50 px-3 py-2"
            }
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {state.message ? (
        <p
          className={`mb-4 rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? undefined : { opacity: 0, x: 12 }}
            animate={reduce ? undefined : { opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -12 }}
            transition={reduce ? { duration: 0 } : transitionShort}
            className="min-h-[200px] space-y-4"
          >
            {step === 0 ? (
              <>
                <label className={labelClassName}>
                  Ad soyad
                  <input
                    name="fullName"
                    value={values.fullName}
                    onChange={set("fullName")}
                    className={fieldClassName}
                  />
                  <FieldError errors={state.fieldErrors?.fullName} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClassName}>
                    E-posta
                    <input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={set("email")}
                      className={fieldClassName}
                    />
                    <FieldError errors={state.fieldErrors?.email} />
                  </label>
                  <label className={labelClassName}>
                    Telefon
                    <input
                      name="phone"
                      inputMode="tel"
                      value={values.phone}
                      onChange={set("phone")}
                      className={fieldClassName}
                    />
                    <FieldError errors={state.fieldErrors?.phone} />
                  </label>
                </div>
                <label className={labelClassName}>
                  Tercih edilen şube
                  <select
                    name="branchSlug"
                    value={values.branchSlug}
                    onChange={set("branchSlug")}
                    className={fieldClassName}
                  >
                    <option value="">Seçiniz</option>
                    {branches.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        {formatBranchLocation(b)}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <label className={labelClassName}>
                  Pozisyon
                  <input
                    name="position"
                    value={values.position}
                    onChange={set("position")}
                    className={fieldClassName}
                  />
                  <FieldError errors={state.fieldErrors?.position} />
                </label>
                <label className={labelClassName}>
                  Deneyim (yıl)
                  <input
                    name="experienceYears"
                    type="number"
                    min={0}
                    max={50}
                    value={values.experienceYears}
                    onChange={set("experienceYears")}
                    className={fieldClassName}
                  />
                  <FieldError errors={state.fieldErrors?.experienceYears} />
                </label>
                <label className={labelClassName}>
                  Öğrenim / sertifikalar
                  <textarea
                    name="education"
                    rows={3}
                    value={values.education}
                    onChange={set("education")}
                    className={fieldClassName}
                  />
                  <FieldError errors={state.fieldErrors?.education} />
                </label>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <label className={labelClassName}>
                  Ön yazı
                  <textarea
                    name="coverLetter"
                    rows={6}
                    value={values.coverLetter}
                    onChange={set("coverLetter")}
                    className={fieldClassName}
                  />
                  <FieldError errors={state.fieldErrors?.coverLetter} />
                </label>
                <label className={labelClassName}>
                  CV (PDF veya Word, max 5 MB)
                  <input
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className={`${fieldClassName} file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-900`}
                  />
                  {cvFile ? (
                    <span className="mt-1 block text-xs text-emerald-800">
                      Seçilen dosya: {cvFile.name}
                    </span>
                  ) : null}
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm leading-6 text-zinc-700">
                  <input
                    name="kvkk"
                    type="checkbox"
                    checked={kvkk}
                    onChange={(e) => setKvkk(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-[var(--color-primary)]"
                  />
                  <span>
                    <a
                      href="/kvkk"
                      className="font-medium text-[var(--color-primary)] hover:underline"
                    >
                      KVKK metnini
                    </a>{" "}
                    okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                  </span>
                </label>
                <FieldError errors={state.fieldErrors?.kvkk} />
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-3 pt-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Geri
            </button>
          ) : null}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-[var(--color-primary-dark)]"
            >
              İleri
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
            >
              {pending ? "Gönderiliyor…" : "Başvuruyu gönder"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="mt-1 block text-xs text-red-600">{errors[0]}</span>;
}
