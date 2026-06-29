import "server-only";

import {
  idariKadro,
  type StaffMember as StaticStaffMember,
} from "@/content/idari-kadro";
import { getPayloadClient } from "@/lib/payload";

export async function getStaffMembers(): Promise<StaticStaffMember[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "staff",
      sort: "_order",
      limit: 200,
      depth: 1,
    });

    if (result.docs.length === 0) {
      return idariKadro;
    }

    return result.docs.map((doc) => {
      const photo = doc.photo;
      const photoUrl =
        photo && typeof photo === "object" && "url" in photo
          ? (photo.url as string)
          : undefined;

      return {
        id: String(doc.id),
        name: doc.fullName as string,
        title: doc.title as string,
        department: doc.department as StaticStaffMember["department"],
        branchSlug: (doc.branchSlug as StaticStaffMember["branchSlug"]) || undefined,
        photoUrl,
      };
    });
  } catch {
    return idariKadro;
  }
}
