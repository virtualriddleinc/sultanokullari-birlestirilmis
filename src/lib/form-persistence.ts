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
  cv?: number;
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
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        branchSlug: data.branchSlug,
        position: data.position,
        experienceYears: data.experienceYears,
        education: data.education,
        coverLetter: data.coverLetter,
        ...(data.cv ? { cv: data.cv } : {}),
        status: "new",
      },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("[ik-applications] kayıt hatası:", error);
  }
}
