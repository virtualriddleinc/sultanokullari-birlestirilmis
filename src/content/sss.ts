export type SssCategory = {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
};

export const SSS_CATEGORIES: SssCategory[] = [
  {
    id: "kayit",
    title: "Kayıt ve Başvuru",
    items: [
      {
        question: "Sultan Okulları'na nasıl başvurulur?",
        answer:
          "Ön bilgi ve kayıt talebi için iletişim formunu doldurabilir veya kampüs telefonlarından bize ulaşabilirsiniz. Burs ve indirim koşulları için /kurumsal/burs-olanaklari sayfasını inceleyebilirsiniz.",
      },
      {
        question: "Sultan Okulları hangi şehirlerde?",
        answer:
          "İstanbul (Sancaktepe), Kocaeli (Başiskele), Sakarya (Serdivan), Ankara (Sincan) kampüslerimiz aktiftir. Konya — Mevlânâ şubemiz yakında açılacaktır.",
      },
      {
        question: "Sultan Okulları kaça kadar eğitim veriyor?",
        answer:
          "Kampüse göre anaokulu, ilkokul ve ortaokul kademeleri sunulmaktadır. Başiskele kampüsümüzde ilkokul ve ortaokul; diğer aktif kampüslerimizde anaokulu programı yer alır.",
      },
    ],
  },
  {
    id: "egitim",
    title: "Eğitim Programı",
    items: [
      {
        question: "Sultan Okulları yabancı dil eğitimi var mı?",
        answer:
          "Evet. Çift yabancı dil programımız İngilizce ve Arapça odaklıdır. Detaylar için /egitim/cift-yabanci-dil sayfasını ziyaret edebilirsiniz.",
      },
      {
        question: "Değerler eğitimi nasıl uygulanıyor?",
        answer:
          "Değerler eğitimi müfredatın her alanına işlenir; aylık temalar, Değerler Eğitimi Komisyonu planı ve sınıf etkinlikleriyle yaşatılır. Ayrıntılar /egitim/degerler-egitimi sayfasında.",
      },
      {
        question: "Sultan Mektep Modeli nedir?",
        answer:
          "Bilginin hikmete, bilincin erdeme dönüştüğü özgün eğitim modelimizdir. Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bütün olarak ele alır. /egitim/kademeler sayfasında özetlenmiştir.",
      },
    ],
  },
  {
    id: "gunluk",
    title: "Günlük Okul Hayatı",
    items: [
      {
        question: "Servis hizmeti var mı?",
        answer:
          "Servis imkânları kampüs bazında değerlendirilmektedir. Güncel bilgi için ilgili kampüsümüze başvurabilirsiniz.",
      },
      {
        question: "Yemek ve beslenme nasıl sağlanıyor?",
        answer:
          "Beslenme düzenimiz ana sayfadaki Yemekhane bölümünde (/#yemekhane) anlatılmaktadır. Kantinsiz okul projesi kapsamında helal sertifikalı, günlük hazırlanan menüler sunulmaktadır.",
      },
    ],
  },
  {
    id: "ucret",
    title: "Ücretler ve Burslar",
    items: [
      {
        question: "Burs imkânları nelerdir?",
        answer:
          "Akademik başarı ve yönetim kurulu onaylı ihtiyaç durumlarında burs uygulanabilir. Belirli gruplar için %10 indirim oranları /kurumsal/burs-olanaklari sayfasında listelenmiştir.",
      },
      {
        question: "Ücret bilgisi nasıl alınır?",
        answer:
          "Güncel ücret ve kayıt koşulları için iletişim formu veya kampüs telefonları üzerinden bilgi talep edebilirsiniz.",
      },
    ],
  },
  {
    id: "iletisim",
    title: "İletişim ve Ziyaret",
    items: [
      {
        question: "Okul ziyareti yapılabilir mi?",
        answer:
          "Evet. Kampüs ziyareti ve tanışma görüşmesi için /iletisim sayfasından randevu talebi oluşturabilirsiniz.",
      },
      {
        question: "Sultan Okulları Sancaktepe'ye nasıl ulaşılır?",
        answer:
          "Sancaktepe kampüs adresi: Eyüp Sultan, Emsal Sk. No: 7 D:1, 34885 Sancaktepe/İstanbul. Detaylı konum /okullarimiz/istanbul/sancaktepe sayfasındaki harita bağlantısından görülebilir.",
      },
    ],
  },
];

export const ALL_SSS_ITEMS = SSS_CATEGORIES.flatMap((category) => category.items);

export const BURS_FAQ_ITEMS = [
  {
    question: "Burs başvurusu nasıl yapılır?",
    answer:
      "Ön bilgi için iletişim formunu doldurun veya kampüsümüzü arayın. Gerekli evrak listesi hazırlandığında bu sayfada yayımlanacaktır.",
  },
  {
    question: "Hangi gruplara indirim uygulanır?",
    answer:
          "Kurum politikası gereği belirli gruplar için %10 indirim uygulanmaktadır. Güncel liste sayfadaki tabloda yer alır.",
  },
  {
    question: "Akademik başarı bursu var mı?",
    answer:
      "Evet. Akademik başarı ve ihtiyaç temelli burs imkânları yönetim kurulu onayıyla değerlendirilir.",
  },
];

export const BURS_HOWTO_STEPS = [
  {
    name: "Ön bilgi talebi",
    text: "İletişim formunu doldurun veya kampüs telefonlarından bize ulaşın.",
  },
  {
    name: "Tanışma görüşmesi",
    text: "Aile ile okul tanışması ve program hakkında bilgilendirme yapılır.",
  },
  {
    name: "Evrak teslimi",
    text: "Kayıt için gerekli belgeler kampüs tarafından bildirilir ve teslim alınır.",
  },
  {
    name: "Kayıt onayı",
    text: "Değerlendirme sonrası kayıt süreci tamamlanır.",
  },
];
