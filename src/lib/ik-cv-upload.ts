import "server-only";

import { getPayloadClient } from "@/lib/payload";

const ALLOWED_CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_CV_BYTES = 5 * 1024 * 1024;

export async function uploadIkCv(
  file: File,
): Promise<{ ok: true; id: number } | { ok: false; message: string }> {
  if (file.size > MAX_CV_BYTES) {
    return { ok: false, message: "CV dosyası en fazla 5 MB olabilir." };
  }
  if (!ALLOWED_CV_MIME.has(file.type)) {
    return {
      ok: false,
      message: "CV yalnızca PDF veya Word (.doc/.docx) olabilir.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const payload = await getPayloadClient();

  try {
    const doc = await payload.create({
      collection: "application-files",
      data: {
        alt: `İK CV — ${file.name}`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name.replace(/[^\w.\-ğüşıöçĞÜŞİÖÇ ]+/gi, "_").slice(0, 120),
        size: buffer.length,
      },
      overrideAccess: true,
    });
    return { ok: true, id: Number(doc.id) };
  } catch (error) {
    console.error("[ik-cv] yükleme hatası:", error);
    return { ok: false, message: "CV yüklenemedi. Lütfen tekrar deneyin." };
  }
}
