import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "src", "app");

const pages = [
  ["kurumsal/hakkimizda", "Hakkımızda", "Kuruluş, gaye ve kurucu mesajı."],
  ["kurumsal/idari-kadro", "İdari kadro", "Yönetim ekibi tanıtımı."],
  ["kurumsal/insan-kaynaklari", "İnsan kaynakları", "Kariyer ve başvuru."],
  [
    "kurumsal/neden-sultan",
    "Neden Sultan Okulları?",
    "Kurum farklılıklarımız.",
  ],
  [
    "kurumsal/burs-olanaklari",
    "Burs olanakları",
    "Burs ve indirim politikaları.",
  ],
  ["egitim/anaokulu", "Anaokulu", "Anaokulu programı."],
  ["egitim/ilkokul", "İlkokul", "İlkokul programı."],
  ["egitim/ortaokul", "Ortaokul", "Ortaokul programı."],
  ["egitim/nebevi-egitim", "Nebevî eğitim", "Nebevî eğitim yaklaşımımız."],
  ["egitim/hafizlik", "Hafızlık eğitimi", "Hafızlık ve Otağ-ı Hümâyun."],
  [
    "egitim/degerler-egitimi",
    "Değerler eğitimi",
    "Aylık değerler ve etkinlikler.",
  ],
  ["egitim/cift-yabanci-dil", "Çift yabancı dil", "İngilizce ve Arapça."],
  [
    "egitim/olcme-degerlendirme",
    "Ölçme ve değerlendirme",
    "PISA, rubrik ve portfolyo.",
  ],
  [
    "atolyeler-ve-kulupler",
    "Atölyeler ve kulüpler",
    "Atölye ve kulüp programlarımız.",
  ],
  ["rehberlik", "Rehberlik", "PDR ve veli akademisi."],
  ["guncel/etkinlikler", "Etkinlikler", "Okul etkinlik takvimi."],
  ["guncel/haberler", "Haberler ve duyurular", "Güncel haberler."],
  ["guncel/medya", "Medya", "Fotoğraf ve video galerisi."],
  ["iletisim", "İletişim", "İletişim ve ön kayıt."],
  ["kvkk", "KVKK", "Kişisel verilerin korunması."],
  [
    "gizlilik-politikasi",
    "Gizlilik politikası",
    "Gizlilik ve çerez politikası.",
  ],
];

const tpl = (routePath, title, desc) => `import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "${title}",
  description: "${desc}",
};

export default function Page() {
  return (
    <PageShell title="${title}" intro="${desc}">
      <p className="text-zinc-600">
        İçerik <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm">site-icerigi.docx</code>{" "}
        kaynağından statik modüllere aktarılacaktır. Bu sayfa yapı iskeletidir.
      </p>
    </PageShell>
  );
}
`;

for (const [rel, title, desc] of pages) {
  const dir = path.join(appDir, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), tpl(rel, title, desc), "utf8");
}

console.log("Wrote", pages.length, "stub pages");
