import type { LucideIcon } from "lucide-react";
import {
  Award,
  Baby,
  Book,
  BookOpen,
  Building2,
  Coffee,
  Compass,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Landmark,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  School,
  Shield,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

export type SitemapLink = {
  title: string;
  path: string;
};

export type SitemapCategory = {
  key: string;
  label: string;
  icon: LucideIcon;
  links: SitemapLink[];
};

export type SitemapQuickLink = SitemapLink & {
  icon: LucideIcon;
};

export const SITEMAP_QUICK_LINKS: SitemapQuickLink[] = [
  { title: "Ana Sayfa", path: "/", icon: Home },
  { title: "İletişim", path: "/iletisim", icon: Mail },
  { title: "SSS", path: "/sss", icon: Phone },
  { title: "Haberler", path: "/guncel/haberler", icon: Newspaper },
  { title: "Etkinlikler", path: "/guncel/etkinlikler", icon: Sparkles },
  { title: "Medya", path: "/guncel/medya", icon: Globe },
  { title: "Okullarımız", path: "/okullarimiz/istanbul/sancaktepe", icon: MapPin },
];

export const SITEMAP_CATEGORIES: SitemapCategory[] = [
  {
    key: "kurumsal",
    label: "Kurumsal",
    icon: Landmark,
    links: [
      { title: "Kurumsal Kimliğimiz", path: "/kurumsal/kurumsal-kimligimiz" },
      { title: "Niyetimiz ve İstikametimiz", path: "/kurumsal/niyetimiz-istikametimiz" },
      { title: "Nesil Tasavvurumuz", path: "/kurumsal/nesil-tasavvurumuz" },
      { title: "Kurumsal Değerlerimiz", path: "/kurumsal/kurumsal-degerlerimiz" },
      { title: "Hakkımızda", path: "/kurumsal/hakkimizda" },
      { title: "İdari Kadro", path: "/kurumsal/idari-kadro" },
      { title: "Burs Olanakları", path: "/kurumsal/burs-olanaklari" },
      { title: "İnsan Kaynakları", path: "/kurumsal/insan-kaynaklari" },
      { title: "Neden Sultan Okulları?", path: "/kurumsal/neden-sultan" },
    ],
  },
  {
    key: "egitim",
    label: "Eğitim",
    icon: BookOpen,
    links: [
      { title: "Sultan Mektebi Modeli & Kademeler", path: "/egitim/kademeler" },
      { title: "Nebevî Eğitim ve Kur'an-ı Kerîm", path: "/egitim/nebevi-egitim" },
      { title: "Değerler ve Mânevî Eğitim", path: "/egitim/degerler-egitimi" },
      { title: "Anaokulu", path: "/egitim/anaokulu" },
      { title: "İlkokul", path: "/egitim/ilkokul" },
      { title: "Ortaokul", path: "/egitim/ortaokul" },
      { title: "Hâfızlık Eğitimi", path: "/egitim/hafizlik" },
    ],
  },
  {
    key: "akademik",
    label: "Akademik",
    icon: Award,
    links: [
      { title: "Akademik Gelişim ve Tâkib", path: "/akademik/gelisim" },
      { title: "Yabancı Dil & Atölyeler", path: "/akademik/yabanci-dil" },
      { title: "Atölyeler ve Kulüpler", path: "/atolyeler-ve-kulupler" },
    ],
  },
  {
    key: "rehberlik",
    label: "Rehberlik & Veli",
    icon: HeartHandshake,
    links: [
      { title: "Rehberlik ve Eğitim Koçluğu", path: "/rehberlik/egitim-koclugu" },
      { title: "Sultanda Veli Olmak & Veli Akademisi", path: "/rehberlik/veli" },
    ],
  },
  {
    key: "yasam",
    label: "Sultanda Yaşam",
    icon: Coffee,
    links: [{ title: "Sultanda Yaşam", path: "/yasam/sultanda-yasam" }],
  },
  {
    key: "okullar",
    label: "Okullarımız",
    icon: MapPin,
    links: [
      { title: "Sancaktepe – İstanbul", path: "/okullarimiz/istanbul/sancaktepe" },
      { title: "Başiskele – Kocaeli", path: "/okullarimiz/kocaeli/basiskele" },
      { title: "Serdivan – Sakarya", path: "/okullarimiz/sakarya/serdivan" },
      { title: "Sincan – Ankara", path: "/okullarimiz/ankara/sincan" },
      { title: "Mevlânâ – Konya", path: "/okullarimiz/konya/mevlana" },
    ],
  },
  {
    key: "yasal",
    label: "Yasal & Bilgi",
    icon: Shield,
    links: [
      { title: "KVKK Aydınlatma Metni", path: "/kvkk" },
      { title: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
      { title: "Sık Sorulan Sorular", path: "/sss" },
      { title: "Site Haritası", path: "/sitemap" },
    ],
  },
];

/** Tüm bağlantıları düz liste olarak döndürür (arama için). */
export function getAllSitemapLinks(): SitemapLink[] {
  const seen = new Set<string>();
  const links: SitemapLink[] = [];

  for (const item of [...SITEMAP_QUICK_LINKS, ...SITEMAP_CATEGORIES.flatMap((c) => c.links)]) {
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    links.push({ title: item.title, path: item.path });
  }

  return links.sort((a, b) => a.title.localeCompare(b.title, "tr"));
}

/** Kategori kartları için ikon eşlemesi (alt sayfa linkleri). */
export const SITEMAP_LINK_ICONS: Record<string, LucideIcon> = {
  "/kurumsal/kurumsal-kimligimiz": Building2,
  "/kurumsal/niyetimiz-istikametimiz": Compass,
  "/kurumsal/nesil-tasavvurumuz": Users,
  "/kurumsal/kurumsal-degerlerimiz": Heart,
  "/egitim/kademeler": GraduationCap,
  "/egitim/nebevi-egitim": Book,
  "/egitim/degerler-egitimi": Star,
  "/egitim/anaokulu": Baby,
  "/egitim/ilkokul": School,
  "/egitim/ortaokul": GraduationCap,
  "/akademik/gelisim": TrendingUp,
  "/rehberlik/egitim-koclugu": Users,
  "/rehberlik/veli": UserCheck,
  "/yasam/sultanda-yasam": Smile,
  "/kvkk": FileText,
  "/gizlilik-politikasi": Shield,
};
