import type { Field } from "payload";

export const lastEditedByField: Field = {
  name: "lastEditedBy",
  type: "relationship",
  relationTo: "users",
  label: "Son düzenleyen",
  admin: {
    position: "sidebar",
    readOnly: true,
    description: "Kaydı en son güncelleyen panel kullanıcısı.",
  },
};
