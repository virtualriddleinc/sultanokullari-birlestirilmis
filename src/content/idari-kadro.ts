export type Department = "yonetim" | "egitim" | "idari";

export type BranchSlug = "sancaktepe" | "basiskele" | "serdivan" | "sincan";

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: Department;
  /** Yönetim (merkez) kadrosunda undefined. Diğer departmanlarda zorunlu. */
  branchSlug?: BranchSlug;
  photoUrl?: string;
}

export const departmentLabels: Record<Department, string> = {
  yonetim: "Yönetim",
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
  { id: "y1", name: "Ad Soyad", title: "Genel Müdür", department: "yonetim" },
  {
    id: "y2",
    name: "Ad Soyad",
    title: "Genel Müdür Yardımcısı",
    department: "yonetim",
  },
  {
    id: "y3",
    name: "Ad Soyad",
    title: "Eğitim Koordinatörü",
    department: "yonetim",
  },
  {
    id: "y4",
    name: "Ad Soyad",
    title: "Mali İşler Müdürü",
    department: "yonetim",
  },

  {
    id: "sn-e1",
    name: "Ad Soyad",
    title: "Okul Müdürü",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-e2",
    name: "Ad Soyad",
    title: "Müdür Yardımcısı",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-e3",
    name: "Ad Soyad",
    title: "Rehber Öğretmen",
    department: "egitim",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-i1",
    name: "Ad Soyad",
    title: "Okul Sekreteri",
    department: "idari",
    branchSlug: "sancaktepe",
  },
  {
    id: "sn-i2",
    name: "Ad Soyad",
    title: "Muhasebe",
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
