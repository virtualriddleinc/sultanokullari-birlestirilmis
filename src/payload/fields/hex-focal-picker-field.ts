import type { Field } from "payload";

/** Hero slayt altıgen odak seçici — UI alanı (veri tutmaz) */
export function hexFocalPickerField(name = "hexFocalPicker"): Field {
  return {
    name,
    type: "ui",
    admin: {
      components: {
        Field: "@/components/payload/admin/HexFocalPointPicker#default",
      },
    },
  };
}
