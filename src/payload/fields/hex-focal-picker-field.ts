import type { Field } from "payload";

type HexFocalPickerOptions = {
  /** Medya group adı — Hero: slideMedia, petek: media */
  mediaPathPrefix?: string;
};

/** Altıgen odak seçici — UI alanı (veri tutmaz) */
export function hexFocalPickerField(
  name = "hexFocalPicker",
  options: HexFocalPickerOptions = {},
): Field {
  const { mediaPathPrefix = "slideMedia" } = options;
  return {
    name,
    type: "ui",
    admin: {
      components: {
        Field: {
          path: "@/components/payload/admin/HexFocalPointPicker#default",
          clientProps: { mediaPathPrefix },
        },
      },
    },
  };
}
