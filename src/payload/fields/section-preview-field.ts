import type { Field } from "payload";

export function sectionPreviewField(
  name: string,
  component: string,
): Field {
  return {
    name,
    type: "ui",
    admin: {
      components: {
        Field: component,
      },
    },
  };
}
