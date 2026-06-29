"use server";

import { getPayloadClient } from "@/lib/payload";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branchSlug?: string;
  source: "contact" | "info_request";
};

type IkPayload = {
  fullName: string;
  email: string;
  phone: string;
  branchSlug?: string;
  position: string;
  experienceYears: number;
  education: string;
  coverLetter: string;
};

export async function persistContactMessage(data: ContactPayload): Promise<void> {
  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "contact-messages",
      data: {
        ...data,
        status: "new",
      },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("[contact-messages] kayıt hatası:", error);
  }
}

export async function persistIkApplication(data: IkPayload): Promise<void> {
  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "ik-applications",
      data: {
        ...data,
        status: "new",
      },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("[ik-applications] kayıt hatası:", error);
  }
}
