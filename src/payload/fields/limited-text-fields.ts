import type { TextField, TextareaField } from "payload";

const LIMITED_TEXT_FIELD =
  "@/components/payload/admin/LimitedTextField#default";

export function limitedText(
  field: Omit<TextField, "type" | "hasMany"> & { type?: "text" },
  max: number,
): TextField {
  return {
    ...field,
    type: "text",
    hasMany: false,
    maxLength: max,
    admin: {
      ...field.admin,
      components: {
        Field: {
          path: LIMITED_TEXT_FIELD,
          clientProps: { maxLength: max },
        },
      },
    },
  } as TextField;
}

export function limitedTextarea(
  field: Omit<TextareaField, "type"> & { type?: "textarea" },
  max: number,
): TextareaField {
  return {
    ...field,
    type: "textarea",
    maxLength: max,
    admin: {
      ...field.admin,
      components: {
        Field: {
          path: LIMITED_TEXT_FIELD,
          clientProps: { maxLength: max, multiline: true },
        },
      },
    },
  };
}
