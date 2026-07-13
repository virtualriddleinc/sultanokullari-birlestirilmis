"use client";

import React, { useCallback } from "react";
import {
  FieldError,
  FieldLabel,
  TextInput,
  useField,
} from "@payloadcms/ui";

type FieldShape = {
  name?: string;
  label?: string;
  required?: boolean;
  maxLength?: number;
  localized?: boolean;
  admin?: {
    className?: string;
    placeholder?: string;
    rows?: number;
    rtl?: boolean;
  };
};

type Props = {
  field: FieldShape;
  path: string;
  readOnly?: boolean;
  validate?: (value: unknown, options: Record<string, unknown>) => unknown;
  multiline?: boolean;
  maxLength?: number;
};

function CharacterCounter({ length, max }: { length: number; max: number }) {
  if (max <= 0) return null;
  const atMax = length >= max;
  return (
    <div
      className={[
        "sultan-limited-text__counter",
        atMax ? "sultan-limited-text__counter--at-max" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
    >
      {length} / {max}
      {atMax ? " — karakter sınırına ulaşıldı" : ""}
    </div>
  );
}

/**
 * Metin / textarea — maxLength yazımda ve yapıştırmada sert kesilir;
 * sınırda kırmızı sayaç gösterir.
 */
export default function LimitedTextField(props: Props) {
  const path = props.path || props.field?.name || "";
  const max = props.maxLength ?? props.field?.maxLength ?? 0;
  const multiline = Boolean(props.multiline);
  const required = Boolean(props.field?.required);
  const readOnly = Boolean(props.readOnly);
  const localized = Boolean(props.field?.localized);
  const label = props.field?.label;
  const className = props.field?.admin?.className;
  const placeholder =
    typeof props.field?.admin?.placeholder === "string"
      ? props.field.admin.placeholder
      : undefined;
  const rows = props.field?.admin?.rows ?? 3;
  const rtl = Boolean(props.field?.admin?.rtl);

  const memoizedValidate = useCallback(
    (value: unknown, options: Record<string, unknown>): string | true => {
      if (typeof props.validate === "function") {
        const result = props.validate(value, {
          ...options,
          maxLength: max || undefined,
          required,
        });
        if (result === true || typeof result === "string") return result;
        return true;
      }
      return true;
    },
    [props.validate, max, required],
  );

  const { value, setValue, showError, disabled } = useField<string>({
    potentiallyStalePath: path,
    // Payload Validate generics vary by field; wrapper normalizes to string|true
    validate: memoizedValidate as never,
  });

  const text = typeof value === "string" ? value : "";
  const length = text.length;
  const atMax = max > 0 && length >= max;
  const isReadOnly = readOnly || disabled;

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const next = event.target.value;
    setValue(max > 0 ? next.slice(0, max) : next);
  };

  if (!path) {
    return (
      <p className="sultan-limited-text__counter sultan-limited-text__counter--at-max">
        Alan yolu eksik — lütfen sayfayı yenileyin.
      </p>
    );
  }

  const wrapClass = [
    "sultan-limited-text",
    atMax ? "sultan-limited-text--at-max" : "",
    showError ? "error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const counter = <CharacterCounter length={length} max={max} />;

  if (multiline) {
    const fieldId = `field-${path.replace(/\./g, "__")}`;
    return (
      <div
        className={["field-type", "textarea", wrapClass, className]
          .filter(Boolean)
          .join(" ")}
      >
        <FieldLabel
          htmlFor={fieldId}
          label={label}
          localized={localized}
          path={path}
          required={required}
        />
        <div className="field-type__wrap">
          <FieldError path={path} showError={showError} />
          <div className="textarea-outer">
            <textarea
              data-rtl={rtl || undefined}
              disabled={isReadOnly}
              id={fieldId}
              maxLength={max > 0 ? max : undefined}
              name={path}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              rows={rows}
              value={text}
            />
          </div>
          {counter}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <TextInput
        AfterInput={counter}
        className={className}
        Error={<FieldError path={path} showError={showError} />}
        htmlAttributes={
          max > 0
            ? ({ maxLength: max } as {
                autoComplete?: string;
                maxLength?: number;
              })
            : undefined
        }
        Label={
          <FieldLabel
            label={label}
            localized={localized}
            path={path}
            required={required}
          />
        }
        onChange={onChange}
        path={path}
        placeholder={placeholder}
        readOnly={isReadOnly}
        required={required}
        rtl={rtl}
        showError={showError}
        value={text}
      />
    </div>
  );
}
