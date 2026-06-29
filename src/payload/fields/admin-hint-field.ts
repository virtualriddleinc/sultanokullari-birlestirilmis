import type { Field } from "payload";

/** Editör rehber metni — koleksiyon/global formlarında üst bilgi */
export function adminHintField(name: string, text: string): Field {
  return {
    name,
    type: "ui",
    admin: {
      components: {
        Field: {
          path: "@/components/payload/admin/AdminHint#default",
          clientProps: { text },
        },
      },
    },
  };
}

/** Site önizleme linki */
export function siteLinkField(
  name: string,
  href: string,
  label: string,
): Field {
  return {
    name,
    type: "ui",
    admin: {
      components: {
        Field: {
          path: "@/components/payload/admin/AdminHint#SiteLink",
          clientProps: { href, label },
        },
      },
    },
  };
}
