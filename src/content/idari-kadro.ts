export type Department = "yonetim" | "egitim_danisma" | "egitim" | "idari";

export type BranchSlug = "sancaktepe" | "basiskele" | "serdivan" | "sincan";

export interface StaffMember {
  id: string;
  name: string;
  /** Örn. "Dr.", "Prof. Dr.", "Öğr. Gör.". Opsiyonel; ad soyad'ın önüne eklenir. */
  academicTitle?: string;
  /** Görev (örn. "Müdür Yardımcısı"). */
  title: string;
  /** En yüksek eğitim derecesi (örn. "X Üniversitesi Y Bölümü Doktorası"). Opsiyonel. */
  education?: string;
  department: Department;
  /** Yönetim (merkez) kadrosunda undefined. Diğer departmanlarda zorunlu. */
  branchSlug?: BranchSlug;
}

export const departmentLabels: Record<Department, string> = {
  yonetim: "Yönetim",
  egitim_danisma: "Eğitim Danışma Kurulu",
  egitim: "Eğitim",
  idari: "İdari",
};

export const branchOptions: { slug: BranchSlug; name: string; city: string }[] =
  [
    { slug: "sancaktepe", name: "Sancaktepe", city: "İstanbul" },
    { slug: "basiskele", name: "Başiskele", city: "Kocaeli" },
    { slug: "serdivan", name: "Serdivan", city: "Sakarya" },
    { slug: "sincan", name: "Sincan", city: "Ankara" },
  ];

/**
 * İdari kadro. Yönetim (merkez) kadrosu `branchSlug` almaz.
 * Diğer kadrolar 4 okul için ayrı listelenir.
 */
export const idariKadro: StaffMember[] = [
  {
    id: "y1",
    name: "Ad Soyad",
    academicTitle: "Dr.",
    title: "Genel Müdür",
    education: "İstanbul Üniversitesi Eğitim Bilimleri Doktorası",
    department: "yonetim",
  },
  {
    id: "y2",
    name: "Ad Soyad",
    academicTitle: "Dr.",
    title: "Genel Müdür Yardımcısı",
    education: "Ankara Üniversitesi İşletme Yüksek Lisansı",
    department: "yonetim",
  },
  {
    id: "y3",
    name: "Ad Soyad",
    academicTitle: "Öğr. Gör.",
    title: "Eğitim Koordinatörü",
    education: "Marmara Üniversitesi Eğitim Yönetimi Yüksek Lisansı",
    department: "yonetim",
  },

  {
    id: "ed1",
    name: "Ad Soyad",
    academicTitle: "Prof. Dr.",
    title: "Eğitim Danışma Kurulu Üyesi",
    education: "Hacettepe Üniversitesi Eğitim Bilimleri Doktorası",
    department: "egitim_danisma",
  },
  {
    id: "ed2",
    name: "Ad Soyad",
    academicTitle: "Doç. Dr.",
    title: "Eğitim Danışma Kurulu Üyesi",
    education: "Boğaziçi Üniversitesi Psikoloji Doktorası",
    department: "egitim_danisma",
  },
  {
    id: "ed3",
    name: "Ad Soyad",
    academicTitle: "Dr.",
    title: "Eğitim Danışma Kurulu Üyesi",
    education: "ODTÜ Sosyoloji Yüksek Lisansı",
    department: "egitim_danisma",
  },

  {
    id: "sn-e1",
    name: "Ad Soyad",
    academicTitle: "Dr.",
    title: "Okul Müdürü",
    education: "İstanbul Üniversitesi Eğitim Yönetimi Doktorası",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-e2",
    name: "Ad Soyad",
    academicTitle: "Öğr. Gör.",
    title: "Müdür Yardımcısı",
    education: "Marmara Üniversitesi Okul Öncesi Öğretmenliği Lisansı",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-e3",
    name: "Ad Soyad",
    title: "Rehber Öğretmen",
    education: "Anadolu Üniversitesi Rehberlik ve Psikolojik Danışmanlık Lisansı",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-i1",
    name: "Ad Soyad",
    title: "Okul Sekreteri",
    education: "İstanbul Üniversitesi İşletme Lisansı",
    department: "idari",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-i2",
    name: "Ad Soyad",
    title: "Muhasebe",
    education: "Anadolu Üniversitesi Muhasebe Ön Lisans",
    department: "idari",
    branchSlug: "sancaktepe",
  },

  {
    id: "bk-e1",
    name: "Ad Soyad",
    title: "Okul Müdürü",
    department: "egitim",
    branchSlug: "basiskele",
  },
  {
    id: "bk-e2",
    name: "Ad Soyad",
    title: "İlkokul Müdür Yardımcısı",
    department: "egitim",
    branchSlug: "basiskele",
  },
  {
    id: "bk-e3",
    name: "Ad Soyad",
    title: "Ortaokul Müdür Yardımcısı",
    department: "egitim",
    branchSlug: "basiskele",
  },
  {
    id: "bk-e4",
    name: "Ad Soyad",
    title: "Rehber Öğretmen",
    department: "egitim",
    branchSlug: "basiskele",
  },
  {
    id: "bk-i1",
    name: "Ad Soyad",
    title: "Okul Sekreteri",
    department: "idari",
    branchSlug: "basiskele",
  },
  {
    id: "bk-i2",
    name: "Ad Soyad",
    title: "Muhasebe",
    department: "idari",
    branchSlug: "basiskele",
  },

  {
    id: "sr-e1",
    name: "Ad Soyad",
    title: "Okul Müdürü",
    department: "egitim",
    branchSlug: "serdivan",
  },
  {
    id: "sr-e2",
    name: "Ad Soyad",
    title: "Müdür Yardımcısı",
    department: "egitim",
    branchSlug: "serdivan",
  },
  {
    id: "sr-e3",
    name: "Ad Soyad",
    title: "Rehber Öğretmen",
    department: "egitim",
    branchSlug: "serdivan",
  },
  {
    id: "sr-i1",
    name: "Ad Soyad",
    title: "Okul Sekreteri",
    department: "idari",
    branchSlug: "serdivan",
  },

  {
    id: "sc-e1",
    name: "Ad Soyad",
    title: "Okul Müdürü",
    department: "egitim",
    branchSlug: "sincan",
  },
  {
    id: "sc-e2",
    name: "Ad Soyad",
    title: "Müdür Yardımcısı",
    department: "egitim",
    branchSlug: "sincan",
  },
  {
    id: "sc-e3",
    name: "Ad Soyad",
    title: "Rehber Öğretmen",
    department: "egitim",
    branchSlug: "sincan",
  },
  {
    id: "sc-i1",
    name: "Ad Soyad",
    title: "Okul Sekreteri",
    department: "idari",
    branchSlug: "sincan",
  },
];
