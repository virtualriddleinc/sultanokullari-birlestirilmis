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
      return {
        id: String(doc.id),
        name: doc.fullName as string,
        academicTitle: (doc.academicTitle as string) || undefined,
        title: doc.title as string,
        education: (doc.education as string) || undefined,
        department: doc.department as StaticStaffMember["department"],
        branchSlug: (doc.branchSlug as StaticStaffMember["branchSlug"]) || undefined,
      };
    });
  } catch {
    return idariKadro;
  }
}
