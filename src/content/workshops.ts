/**
 * Atölyeler ve kulüpler.
 * PDF genel tanım metni: `@/content/sultanda-yasam` → `atolyelerVeKulupler`.
 * Aşağıdaki madde madde envanter PDF’de yok; silinmedi — karar bekleniyor.
 */
export type WorkshopCategory = "bilim" | "sanat" | "sosyal" | "spor";

export interface WorkshopItem {
  id: string;
  title: string;
  category: WorkshopCategory;
  description: string;
}

/** PDF: Atölyeler ve Kulüpler — genel giriş */
export const workshopIntro = [
  "Özel Sultan Okulları’nda atölyeler ve kulüpler; öğrencilerimizin ilgi alanlarını keşfetmeleri, kabiliyetlerini geliştirmeleri ve üretken bireyler olarak yetişmeleri için planlanır.",
  "Bilginin yalnızca kitaplarda kalmasını değil; öğrencinin zihninde, elinde, davranışında ve üretiminde karşılık bulmasını önemsiyoruz. Bu anlayışla öğrencilerimize yaparak, yaşayarak, deneyerek ve üreterek öğrenebilecekleri zengin gelişim alanları sunuyoruz.",
  "Atölye ve kulüp çalışmalarımızda bilim, sanat, spor, sosyal sorumluluk ve geleneksel değerler bir bütün olarak ele alınır. Akıl oyunları, deney çalışmaları, görsel sanatlar, ebru, el becerileri, okçuluk, geleneksel oyunlar, sosyal sorumluluk ve vefa çalışmalarıyla öğrencilerimizin farklı yönlerini keşfetmeleri desteklenir.",
  "Bu çalışmalar sayesinde öğrencilerimiz; ekip çalışması yapmayı, problem çözmeyi, üretmeyi, paylaşmayı, sorumluluk almayı ve özgüven kazanmayı öğrenir.",
  "Atölyelerimizde temel amacımız; hazır bilgiyle yetinen değil, düşünen, üreten, paylaşan ve değer katan öğrenciler yetiştirmektir.",
] as const;

/** PDF dışı envanter — silinmedi; karar bekleniyor */
export const workshopItems: WorkshopItem[] = [
  {
    id: "robotik",
    title: "Robotik kodlama atölyesi",
    category: "bilim",
    description:
      "Öğrencilerimizi fikir üretip hayata geçiren, tasarlayıp paylaşan bireyler olarak yetiştirmeyi amaçlıyoruz. Matematik ve fen bilimlerindeki kazanımları bilişim teknolojileriyle birleştirerek robotik ve kodlama dünyasına adım atmalarına zemin hazırlıyoruz.",
  },
  {
    id: "akil-zeka",
    title: "Akıl ve zeka oyunları",
    category: "bilim",
    description:
      "Planlı hareket etme, mantık yürütme, görsel-uzamsal düşünme, hafıza ve bellek gelişimi ve zekayı aktif tutarak öğrenmeyi kolaylaştırır.",
  },
  {
    id: "origami",
    title: "Origami",
    category: "sanat",
    description:
      "Kağıdın hayal gücü ile buluştuğu origami atölyemiz çocukların davranışsal, sosyal ve duygusal gelişimlerine, psikomotor ve matematik eğitimine katkı sağlar.",
  },
  {
    id: "dogal-sabun",
    title: "Doğal sabun atölyesi",
    category: "sanat",
    description:
      "Öğrencilerimiz “Doğal sabun nasıl yapılır?” sorusunun cevabını yaparak ve yaşayarak deneyimlemektedir.",
  },
  {
    id: "gorsel-sanatlar",
    title: "Görsel sanatlar atölyesi",
    category: "sanat",
    description:
      "Karakalem, baskı gibi çeşitli tekniklerle düşünme ve zihindekileri görsel araçlarla ifade etme becerileri geliştirilmektedir.",
  },
  {
    id: "yazarlik",
    title: "Yazarlık atölyesi",
    category: "sanat",
    description:
      "Yazma yeteneği olan öğrencilerimize destek vererek yeteneklerini geliştirmelerini sağlıyoruz.",
  },
  {
    id: "el-becerileri",
    title: "El becerileri atölyesi",
    category: "sanat",
    description: "Öğrenciler kendi kıyafetlerini ve aksesuarlarını tasarlıyor.",
  },
  {
    id: "atiktansanata",
    title: "Atıktan sanata atölyesi",
    category: "sanat",
    description:
      "Atık malzemelerin değerlendirilmesi, ana ve ara renkler, renk uyumu ve kompozisyon, atık malzemelerden resim çalışması yapılmaktadır.",
  },
  {
    id: "ingilizce-drama",
    title: "İngilizce drama atölyesi",
    category: "sosyal",
    description:
      "Öğrencilerimiz İngilizcelerini geliştirirken eğlenceli bir ortamda pratik yapıyor, sosyalleşme ve paylaşma duygularını öğreniyorlar.",
  },
  {
    id: "sosyal-yardimlasma",
    title: "Sosyal yardımlaşma kulübü",
    category: "sosyal",
    description:
      "Sosyal sorumluluk projeleriyle Vefâ, paylaşma, birlik ve beraberlik, yardımlaşma, diğergâmlık, hürmet, merhamet, infak ve îsar duygularını kazandırıyoruz.",
  },
  {
    id: "helal-gida",
    title: "Helâl gıdâ kulübü",
    category: "sosyal",
    description:
      "“Yiyeceklerimiz helâl mi? Sağlıklı mı?” sorularının cevabını araştırarak öğrencilerimizi ve toplumu bilinçlendirmek için çalışmalar yapılmaktadır.",
  },
  {
    id: "munazara",
    title: "Münâzara kulübü",
    category: "sosyal",
    description:
      "Fikirler arası sentez yaparak görüşünü savunabilen, araştırma becerisini geliştiren, toplum önünde konuşma kabiliyetini artıran öğrencilerin yetişmesini sağlar.",
  },
  {
    id: "yarisma",
    title: "Yarışma kulübü",
    category: "sosyal",
    description:
      "İlgi ve yeteneklerini geliştirmelerine, saygılı rekabet, kazanma ve kaybetme duygularına alışmalarına ve bilimsel düşünce alışkanlığı kazanmalarına imkân sağlar.",
  },
  {
    id: "mental-aritmetik",
    title: "Mental aritmetik atölyesi",
    category: "bilim",
    description:
      "Hesap makinesi olmadan düşünce gücüyle dört işlem; bellek, odaklanma, dinleme-anlama ve problem çözümleme becerilerini geliştirir.",
  },
];
