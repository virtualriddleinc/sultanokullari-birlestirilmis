import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";

export const metadata = buildPageMetadata({
  path: "/gizlilik-politikasi",
  title: "Gizlilik Politikası",
  description:
    "Sultan Okulları Gizlilik Politikası — kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar; yapay zekâ görsel bildirimi dahildir.",
});

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-fluid-8 scroll-mt-24 text-[length:var(--text-lg)] font-semibold text-zinc-900 md:text-[length:var(--text-xl)]"
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-fluid-6 text-[length:var(--text-sm)] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
      {children}
    </h3>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-fluid-4 rounded-xl border border-amber-200 bg-amber-50 px-fluid-4 py-fluid-4 text-[length:var(--text-sm)] leading-6 text-amber-900">
      {children}
    </div>
  );
}

const tocItems = [
  { href: "#veri-sorumlusu", label: "Veri Sorumlusu" },
  { href: "#kisisel-veriler", label: "Kişisel Veriler" },
  { href: "#yapay-zeka-gorseller", label: "AI Görseller" },
  { href: "#veri-guvenligi", label: "Veri Güvenliği" },
  { href: "#cerezler", label: "Çerezler" },
  { href: "#gizlilik-haklari", label: "Haklarınız" },
  { href: "#veri-ihlali", label: "Veri İhlali" },
  { href: "#ucuncu-taraf", label: "Üçüncü Taraflar" },
];

export default function Page() {
  return (
    <PageShell
      title="Gizlilik Politikası"
      intro="Bu politika, Sultan Okulları web sitesi ve ilgili çevrim içi kanallar üzerinden toplanan kişisel verilerin nasıl işlendiğini özetler. Ayrıntılı aydınlatma için KVKK Aydınlatma Metnimizi de inceleyiniz."
    >
      {/* İçindekiler */}
      <nav aria-label="Sayfa içeriği" className="not-prose">
        <p className="mb-fluid-3 text-[length:var(--text-xs)] font-semibold tracking-widest text-zinc-500 uppercase">
          İçerik
        </p>
        <ol className="flex flex-wrap gap-fluid-2">
          {tocItems.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-[44px] items-center gap-fluid-2 rounded-full border border-zinc-200 bg-white px-fluid-3 text-[length:var(--text-xs)] font-medium text-zinc-700 transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
              >
                <span className="text-[length:var(--text-xs)] font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Veri Sorumlusu ── */}
      <SectionHeading id="veri-sorumlusu">Veri Sorumlusu</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        kapsamında veri sorumlusu <strong>Sultan Okulları</strong>&#39;dır.
        Başvurularınız için{" "}
        <a
          href="mailto:info@sultanokullari.com"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          info@sultanokullari.com
        </a>{" "}
        veya{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim sayfamız
        </Link>{" "}
        kullanılabilir. Kanunî aydınlatma metni için{" "}
        <Link
          href="/kvkk"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          KVKK Aydınlatma Metni
        </Link>
        ne bakınız.
      </p>

      {/* ── 1. Kişisel Veriler ── */}
      <SectionHeading id="kisisel-veriler">Kişisel Veriler</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Sultan Okulları, eğitim ve destek süreçlerini yürütebilmek ve web
        sitesi üzerinden ilettiğiniz talepleri yanıtlayabilmek için gerekli
        kişisel verileri KVKK ve ilgili mevzuata uygun olarak işler. Yalnızca
        ilgili amaç için gerekli veriler toplanır.
      </p>

      <SubHeading>Topladığımız Kişisel Veriler</SubHeading>
      <div className="mt-fluid-3 grid gap-fluid-3 md:grid-cols-2">
        {[
          {
            title: "Kimlik Bilgileri",
            desc: "Öğrenci ve veli/vasi adı, soyadı; gerektiğinde T.C. kimlik numarası gibi kimlik bilgileri",
          },
          {
            title: "İletişim Bilgileri",
            desc: "E-posta adresi, telefon numarası, adres",
          },
          {
            title: "Eğitim / Başvuru Bilgileri",
            desc: "Ön kayıt ve kayıt talepleri, sınıf/kademe tercihleri ve eğitim süreçlerine ilişkin ilettiğiniz bilgiler",
          },
          {
            title: "Sağlık Bilgileri",
            desc: "Allerji, kronik hastalık gibi özel nitelikli sağlık verileri — yalnızca gerekli olduğu ölçüde ve KVKK md. 6 şartlarına uygun olarak",
          },
          {
            title: "Kullanım / Teknik Veriler",
            desc: "Form gönderimleri; site güvenliği ve işleyişi için IP adresi, tarayıcı ve oturum bilgileri",
          },
          {
            title: "İnsan Kaynakları Başvuruları",
            desc: "İş başvurusu formları üzerinden ilettiğiniz özgeçmiş ve iletişim bilgileri",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-zinc-100 bg-zinc-50 px-fluid-4 py-fluid-3"
          >
            <p className="text-[length:var(--text-xs)] font-semibold text-zinc-900">
              {item.title}
            </p>
            <p className="mt-fluid-1 text-[length:var(--text-xs)] leading-5 text-zinc-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <SubHeading>Veri Toplama Amacı</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Kişisel verileriniz aşağıdaki amaçlarla işlenebilir:
      </p>
      <ul className="mt-fluid-2 list-inside list-disc space-y-fluid-1 pl-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        <li>Kayıt, ön kayıt ve eğitim-öğretim süreçlerini yürütmek</li>
        <li>
          Öğrenci ve velilere yönelik bilgilendirme, duyuru ve etkinlik
          iletişimi sağlamak
        </li>
        <li>Okul güvenliği ile sağlık hizmetlerini planlamak ve uygulamak</li>
        <li>
          Hizmet kalitesini artırmak amacıyla kimliği ifşa edilmeden
          istatistiksel değerlendirme yapmak
        </li>
        <li>
          Yasal yükümlülükleri ve Millî Eğitim Bakanlığı gerekliliklerini yerine
          getirmek
        </li>
        <li>Web sitesi güvenliği, teknik işleyiş ve form spam korumasını sağlamak</li>
      </ul>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Veriler, ilgili amaç ve yasal saklama süreleri boyunca muhafaza edilir;
        süreler dolduğunda veya amaç ortadan kalktığında silinir, yok edilir
        veya anonimleştirilir. Ayrıntılar için{" "}
        <Link
          href="/kvkk"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          KVKK Aydınlatma Metni
        </Link>
        ni inceleyiniz.
      </p>

      {/* ── AI Görseller ── */}
      <SectionHeading id="yapay-zeka-gorseller">
        Yapay Zekâ ile Üretilmiş Görseller
      </SectionHeading>
      <InfoBox>
        Bu web sitesinde yer alan öğrenci, öğretmen, veli/aile ve sınıf, ders
        veya okul yaşamı atmosferini gösteren görseller <strong>yapay zekâ
        (AI) ile üretilmiş sentetik görsellerdir</strong>. Gerçek üçüncü kişilere
        ait öğrenci, öğretmen veya veli fotoğrafları kullanılmamaktadır. Bu
        görseller tanıtım ve illüstrasyon amacı taşır; herhangi bir gerçek
        kişinin kimliğini temsil etmez.
      </InfoBox>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Kurumsal logo, grafik ve benzeri marka unsurları bu bildirimin kapsamı
        dışındadır. Aynı açıklama{" "}
        <Link
          href="/kvkk#bolum-x"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          KVKK Aydınlatma Metni
        </Link>
        nde de yer alır.
      </p>

      {/* ── 2. Veri Güvenliği ── */}
      <SectionHeading id="veri-guvenligi">Veri Güvenliği</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        KVKK md. 12 uyarınca kişisel verilerin hukuka aykırı işlenmesini ve
        erişilmesini önlemek ile verilerin muhafazasını sağlamak amacıyla
        uygun teknik ve idari tedbirler alınır. Hiçbir sistem mutlak güvenlik
        garanti etmez; riskler sürekli gözden geçirilir.
      </p>

      <SubHeading>Uygulanan Güvenlik Önlemleri</SubHeading>
      <div className="mt-fluid-3 space-y-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            title: "İletişim şifrelemesi",
            desc: "Web sitesi üzerinden yapılan veri aktarımlarında SSL/TLS gibi şifreleme protokolleri kullanılır.",
          },
          {
            title: "Erişim kontrolü",
            desc: "Yetkisiz erişimi sınırlamak için erişim yetkileri ve idari kontroller uygulanır.",
          },
          {
            title: "Yedekleme",
            desc: "Veri kaybı riskini azaltmak amacıyla uygun yedekleme uygulamaları kullanılır.",
          },
          {
            title: "Veri minimizasyonu",
            desc: "Yalnızca ilgili amaç için gerekli veriler işlenir; amaçla sınırlılık ilkesi gözetilir.",
          },
        ].map((item) => (
          <div key={item.title}>
            <span className="font-semibold text-zinc-900">{item.title}: </span>
            {item.desc}
          </div>
        ))}
      </div>

      <SubHeading>Veri Saklama ve İmha</SubHeading>
      <ul className="mt-fluid-2 list-inside list-disc space-y-fluid-1 pl-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        <li>
          Veriler, ilgili mevzuatta öngörülen veya işleme amacı için gerekli
          süreler boyunca saklanır.
        </li>
        <li>
          Amaç ortadan kalktığında veya yasal saklama süresi dolduğunda
          veriler silinir, yok edilir veya anonim hâle getirilir.
        </li>
        <li>
          KVKK kapsamındaki haklarınız çerçevesinde, şartları oluştuğunda
          silme veya yok etme talebinde bulunabilirsiniz.
        </li>
      </ul>

      {/* ── 3. Çerezler ── */}
      <SectionHeading id="cerezler">Çerezler ve İzleme</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Web sitemizin temel işlevlerini sunmak ve güvenliğini sağlamak için
        çerez ve benzeri teknolojiler kullanılabilir. İsteğe bağlı analitik veya
        pazarlama araçları kullanılması hâlinde bunlar ilgili mevzuata uygun
        şekilde yönetilir.
      </p>

      <SubHeading>Çerez Nedir?</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Çerezler, sitemizi ziyaret ettiğinizde tarayıcınız tarafından
        cihazınıza kaydedilebilen küçük metin dosyalarıdır. Oturum yönetimi,
        güvenlik ve (kullanılıyorsa) kullanım istatistikleri gibi amaçlara
        hizmet eder.
      </p>

      <SubHeading>Çerez Türleri</SubHeading>
      <div className="mt-fluid-3 space-y-fluid-3">
        {[
          {
            name: "Zorunlu Çerezler",
            desc: "Sitenin temel işlevleri ve güvenliği için gerekli olabilir. Bunlar olmadan bazı özellikler çalışmayabilir.",
          },
          {
            name: "İşlevsellik Çerezleri",
            desc: "Tercihlerinizi hatırlamak gibi kullanıcı deneyimini destekleyen çerezler (kullanılması hâlinde).",
          },
          {
            name: "Analitik Çerezler",
            desc: "Site kullanımını ölçmek için analitik araçlar kullanılması hâlinde; mümkün olduğunca anonim/toplanmış verilerle ve ilgili rıza veya hukuki sebebe dayanılarak işlenir.",
          },
        ].map((c) => (
          <div
            key={c.name}
            className="rounded-xl border border-zinc-100 bg-zinc-50 px-fluid-4 py-fluid-3"
          >
            <p className="text-[length:var(--text-xs)] font-semibold text-zinc-900">
              {c.name}
            </p>
            <p className="mt-fluid-1 text-[length:var(--text-xs)] leading-5 text-zinc-600">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      <SubHeading>Çerez Tercihlerinizi Yönetme</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
        Zorunlu çerezlerin engellenmesi sitenin bazı işlevlerini
        etkileyebilir.
      </p>
      <div className="mt-fluid-3 grid gap-fluid-2 text-[length:var(--text-xs)] md:grid-cols-2">
        {[
          {
            name: "Google Chrome",
            path: "Ayarlar › Gizlilik ve Güvenlik › Çerezler",
          },
          {
            name: "Mozilla Firefox",
            path: "Ayarlar › Gizlilik ve Güvenlik › Çerezler",
          },
          {
            name: "Safari",
            path: "Ayarlar › Gizlilik › Çerezler ve Web Sitesi Verileri",
          },
          {
            name: "Microsoft Edge",
            path: "Ayarlar › Çerezler ve Site İzinleri",
          },
        ].map((b) => (
          <div
            key={b.name}
            className="rounded-lg border border-zinc-100 px-fluid-3 py-fluid-2"
          >
            <p className="font-semibold text-zinc-800">{b.name}</p>
            <p className="mt-0.5 text-zinc-500">{b.path}</p>
          </div>
        ))}
      </div>

      {/* ── 4. Gizlilik Hakları ── */}
      <SectionHeading id="gizlilik-haklari">Gizlilik Hakları</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        KVKK md. 11 kapsamında aşağıdaki haklara sahipsiniz (özet):
      </p>

      <div className="mt-fluid-4 space-y-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            title: "Bilgi edinme",
            desc: "Verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme.",
          },
          {
            title: "Amaç ve aktarım",
            desc: "İşlenme amacını, amaca uygun kullanımı ve aktarıldığı üçüncü kişileri öğrenme.",
          },
          {
            title: "Düzeltme",
            desc: "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme.",
          },
          {
            title: "Silme / yok etme",
            desc: "İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde silinmesini veya yok edilmesini isteme.",
          },
          {
            title: "Otomatik analiz itirazı",
            desc: "Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize sonuç doğmasına itiraz etme.",
          },
          {
            title: "Zararın giderilmesi",
            desc: "Kanuna aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme.",
          },
          {
            title: "Açık rızanın geri alınması",
            desc: "İşlemenin açık rızaya dayandığı hâllerde rızanızı ileriye etkili olarak geri alabilirsiniz; geri alma öncesi işlemlerin hukuka uygunluğunu etkilemez.",
          },
        ].map((r) => (
          <div key={r.title}>
            <span className="font-semibold text-zinc-900">{r.title}: </span>
            {r.desc}
          </div>
        ))}
      </div>

      <SubHeading>Haklarınızı Nasıl Kullanabilirsiniz?</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Başvurularınızı aşağıdaki kanallardan iletebilirsiniz:
      </p>
      <div className="mt-fluid-3 flex flex-col gap-fluid-2 text-[length:var(--text-sm)]">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[length:var(--text-xs)] font-semibold tracking-wide text-zinc-500 uppercase">
            E-posta
          </span>
          <a
            href="mailto:info@sultanokullari.com"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            info@sultanokullari.com
          </a>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[length:var(--text-xs)] font-semibold tracking-wide text-zinc-500 uppercase">
            İletişim formu
          </span>
          <Link
            href="/iletisim"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            İletişim sayfamızdan
          </Link>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[length:var(--text-xs)] font-semibold tracking-wide text-zinc-500 uppercase">
            KVKK detayları
          </span>
          <Link
            href="/kvkk"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            KVKK Aydınlatma Metni
          </Link>
        </div>
      </div>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Başvurular talebin niteliğine göre en kısa sürede ve en geç{" "}
        <strong className="font-semibold text-zinc-900">30 gün</strong> içinde
        sonuçlandırılır; kural olarak ücretsizdir. İşlemin ayrıca maliyet
        gerektirmesi hâlinde Kurul tarifesi uygulanabilir. Kimlik doğrulaması
        için ek bilgi istenebilir.
      </p>

      {/* ── 5. Veri İhlali ── */}
      <SectionHeading id="veri-ihlali">Veri İhlali Bildirimi</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        KVKK md. 12 kapsamında, işlenen kişisel verilerin kanuni olmayan
        yollarla başkaları tarafından elde edilmesi hâlinde durum, en kısa
        sürede Kişisel Verileri Koruma Kurulu&#39;na bildirilir; Kurul&#39;un
        gerek görmesi veya mevzuatın gerektirmesi hâlinde ilgili kişilere de
        bilgi verilir.
      </p>

      <SubHeading>Yönetim Yaklaşımı</SubHeading>
      <ol className="mt-fluid-3 space-y-fluid-4 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            n: "1",
            title: "Tespit ve değerlendirme",
            desc: "Olası bir ihlalde kapsam, etkilenen veri türleri ve riskler değerlendirilir.",
          },
          {
            n: "2",
            title: "Kurula bildirim",
            desc: "Mevzuat gereği Kurul'a en kısa sürede bildirim yapılır.",
          },
          {
            n: "3",
            title: "İlgili kişilerin bilgilendirilmesi",
            desc: "Kurul'un değerlendirmesi veya mevzuatın öngördüğü hâllerde etkilenen kişiler bilgilendirilir.",
          },
          {
            n: "4",
            title: "İyileştirme",
            desc: "Benzer risklerin azaltılması için teknik ve idari tedbirler gözden geçirilir.",
          },
        ].map((step) => (
          <li key={step.n} className="flex gap-4">
            <span className="mt-fluid-1 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-light)] text-[length:var(--text-xs)] font-bold text-[var(--color-primary)]">
              {step.n}
            </span>
            <div>
              <p className="font-semibold text-zinc-900">{step.title}</p>
              <p className="mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-fluid-4 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Verilerinizle ilgili olası bir güvenlik endişeniz varsa{" "}
        <a
          href="mailto:info@sultanokullari.com"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          info@sultanokullari.com
        </a>{" "}
        veya{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim formu
        </Link>{" "}
        üzerinden bize ulaşabilirsiniz.
      </p>

      {/* ── 6. Üçüncü Taraf ── */}
      <SectionHeading id="ucuncu-taraf">Üçüncü Taraf Hizmetler</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Web sitesinin işletilmesi için üçüncü taraf hizmet sağlayıcılar
        kullanılabilir. Bu sağlayıcılar, verdikleri hizmet kapsamında gerekli
        teknik verileri kendi gizlilik politikalarına göre işleyebilir.
      </p>

      <SubHeading>reCAPTCHA</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        İletişim, ön kayıt ve benzeri formlarda spam ve bot koruması amacıyla
        Google reCAPTCHA kullanılabilir. Bu kapsamda toplanan teknik veriler
        Google&#39;ın gizlilik şartlarına tabidir.
      </p>

      <SubHeading>Barındırma ve iletişim altyapısı</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Site barındırma, e-posta iletimi ve içerik yönetimi için hizmet
        sağlayıcılar kullanılabilir. Bu aktarımlar, hizmetin sunulması için
        gerekli olduğu ölçüde ve KVKK&#39;nın aktarım hükümlerine uygun olarak
        gerçekleştirilir.
      </p>

      <SubHeading>Sosyal medya gömülü içerikler</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Sitede Instagram veya benzeri gömülü içerikler bulunması hâlinde ilgili
        platform, kendi çerez ve izleme teknolojilerini uygulayabilir. Bu
        işlemler ilgili platformun politikalarına tabidir.
      </p>

      <p className="mt-fluid-4 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Sorularınız için{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          bizimle iletişime
        </Link>{" "}
        geçebilir veya{" "}
        <Link
          href="/kvkk"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          KVKK Aydınlatma Metni
        </Link>
        ni inceleyebilirsiniz.
      </p>

      {/* Son güncelleme notu */}
      <p className="mt-fluid-8 text-[length:var(--text-xs)] text-zinc-400">
        Son güncelleme: Temmuz 2026 · Sultan Okulları bu politikayı
        güncelleyebilir. Değişiklikler web sitesinde yayımlandığı andan
        itibaren geçerlidir.
      </p>
    </PageShell>
  );
}
