import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Sultan Okulları Gizlilik Politikası — kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.",
};

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
  { href: "#kisisel-veriler", label: "Kişisel Veriler" },
  { href: "#veri-guvenligi", label: "Veri Güvenliği" },
  { href: "#cerezler", label: "Çerezler" },
  { href: "#gizlilik-haklari", label: "Gizlilik Hakları" },
  { href: "#veri-ihlali", label: "Veri İhlali Bildirimi" },
  { href: "#ucuncu-taraf", label: "Üçüncü Taraf Hizmetler" },
];

export default function Page() {
  return (
    <PageShell
      title="Gizlilik Politikası"
      intro="Kişisel verilerinizin korunması ve güvenliği önceliğimizdir. Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar."
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

      {/* ── 1. Kişisel Veriler ── */}
      <SectionHeading id="kisisel-veriler">Kişisel Veriler</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Sultan Okulları olarak, size daha iyi eğitim ve destek hizmeti
        sunabilmek için bazı kişisel bilgilerinizi toplamaktayız. Bu bilgilerin
        kullanımına ilişkin her türlü işlem, 6698 sayılı Kişisel Verilerin
        Korunması Kanunu (KVKK) ve ilgili mevzuata uygun olarak titizlikle
        gerçekleştirilmektedir.
      </p>

      <SubHeading>Topladığımız Kişisel Veriler</SubHeading>
      <div className="mt-fluid-3 grid gap-fluid-3 md:grid-cols-2">
        {[
          {
            title: "Kimlik Bilgileri",
            desc: "Öğrenci ve veli/vasi adı, soyadı, T.C. kimlik numarası gibi temel kimlik bilgileri",
          },
          {
            title: "İletişim Bilgileri",
            desc: "E-posta adresi, telefon numarası, ev ve iş adresi",
          },
          {
            title: "Eğitim Bilgileri",
            desc: "Öğrenci kayıt durumu, sınıf, devam/devamsızlık kayıtları, notlar ve başarı raporları",
          },
          {
            title: "Sağlık Bilgileri",
            desc: "Allerji, kronik hastalık, ilaç kullanımı gibi özel nitelikli sağlık verileri (yalnızca güvenlik ve sağlık hizmetleri için)",
          },
          {
            title: "Kullanım Verileri",
            desc: "Web sitesi IP adresi, tarayıcı bilgileri, oturum verileri ve tıklama analitiği",
          },
          {
            title: "Fotoğraf / Görüntü",
            desc: "Etkinlik, tören ve okul faaliyetlerinde çekilen fotoğraf ve video kayıtları",
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
        Sultan Okulları, kişisel verilerinizi aşağıdaki amaçlar doğrultusunda
        toplar, saklar ve işler:
      </p>
      <ul className="mt-fluid-2 list-inside list-disc space-y-fluid-1 pl-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        <li>Kayıt, ön kayıt ve eğitim-öğretim süreçlerini yürütmek</li>
        <li>
          Öğrenci ve velilere yönelik bilgilendirme, duyuru ve etkinlik
          iletişimi sağlamak
        </li>
        <li>Okul güvenliği ile sağlık hizmetlerini planlamak ve uygulamak</li>
        <li>
          Hizmet kalitesini artırmak amacıyla istatistiksel analizler yapmak
        </li>
        <li>
          Yasal yükümlülükleri ve Millî Eğitim Bakanlığı gerekliliklerini yerine
          getirmek
        </li>
        <li>Web sitesi güvenliği ve teknik işleyişi sağlamak</li>
      </ul>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Kişisel verileriniz, kullanım amacı gerektirdiği sürece ve yasal saklama
        süreleri boyunca sistemlerimizde muhafaza edilmektedir. Bu süreler
        dolduğunda verileriniz uygun yöntemlerle imha edilmektedir. Ayrıntılı
        bilgi için{" "}
        <Link
          href="/kvkk"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          KVKK Aydınlatma Metni
        </Link>
        ni inceleyebilirsiniz.
      </p>

      {/* ── 2. Veri Güvenliği ── */}
      <SectionHeading id="veri-guvenligi">Veri Güvenliği</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Sultan Okulları olarak kişisel verilerinizin güvenliği en büyük
        önceliklerimizden biridir. Verilerinizi korumak için endüstri standardı
        güvenlik önlemlerini uyguluyoruz.
      </p>

      <InfoBox>
        Hiçbir dijital sistem %100 güvenli değildir; ancak verilerinizi korumak
        için sürekli olarak en yüksek güvenlik standartlarını uygulamaktayız.
      </InfoBox>

      <SubHeading>Uygulanan Güvenlik Önlemleri</SubHeading>
      <div className="mt-fluid-3 space-y-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            title: "SSL/TLS Şifreleme",
            desc: "Tüm veri transferlerinde SSL/TLS şifreleme protokolleri kullanılmakta; internet üzerindeki iletişim güvenli biçimde şifrelenmektedir.",
          },
          {
            title: "Düzenli Yedekleme",
            desc: "Veri kaybını önlemek için düzenli ve otomatik yedekleme sistemleri kullanılmakta; yedekler şifreli olarak saklanmaktadır.",
          },
          {
            title: "Güvenlik Duvarları",
            desc: "Gelişmiş güvenlik duvarları ve saldırı tespit sistemleri ile yetkisiz erişimler ve siber saldırılar engellenmektedir.",
          },
          {
            title: "Erişim Kontrolleri",
            desc: "Rol tabanlı erişim kontrolleri ile verilerinize yalnızca yetkili personel ulaşabilmektedir.",
          },
          {
            title: "Veri Minimizasyonu",
            desc: "Yalnızca gerekli verileri toplayarak olası riskleri azaltıyoruz. Amaçla sınırlı veri işleme prensibi uygulanmaktadır.",
          },
        ].map((item) => (
          <div key={item.title}>
            <span className="font-semibold text-zinc-900">{item.title}: </span>
            {item.desc}
          </div>
        ))}
      </div>

      <SubHeading>Veri Saklama ve İmha Politikası</SubHeading>
      <ul className="mt-fluid-2 list-inside list-disc space-y-fluid-1 pl-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        <li>
          Verileriniz, ilgili yasal düzenlemelerde belirtilen süreler boyunca
          saklanır.
        </li>
        <li>
          Hizmete ilişkin yükümlülüklerimiz sona erdiğinde veya veri işleme
          amacı ortadan kalktığında verileriniz silinir, yok edilir veya anonim
          hale getirilir.
        </li>
        <li>
          İmha işlemleri güvenli silme yöntemleri kullanılarak gerçekleştirilir
          ve kayıt altına alınır.
        </li>
        <li>
          Talebiniz üzerine, KVKK kapsamındaki haklarınız çerçevesinde
          verilerinizin silinmesini isteyebilirsiniz.
        </li>
      </ul>

      {/* ── 3. Çerezler ── */}
      <SectionHeading id="cerezler">Çerezler ve İzleme</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Web sitemizde deneyiminizi en iyi hale getirmek, site performansını
        analiz etmek ve daha kişiselleştirilmiş bir hizmet sunmak için çerez ve
        benzer teknolojileri kullanmaktayız.
      </p>

      <SubHeading>Çerez Nedir?</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız tarafından
        cihazınıza kaydedilen küçük metin dosyalarıdır. Siteyi nasıl
        kullandığınız, hangi sayfaları ziyaret ettiğiniz hakkında bilgi toplar
        ve sonraki ziyaretlerinizde sitemizi daha kullanışlı hale getirmemize
        yardımcı olur.
      </p>

      <SubHeading>Kullandığımız Çerez Türleri</SubHeading>
      <div className="mt-fluid-3 space-y-fluid-3">
        {[
          {
            name: "Zorunlu Çerezler",
            desc: "Web sitemizin düzgün çalışması için gereklidir. Giriş oturumu, güvenlik doğrulaması gibi temel işlevleri sağlar; bu çerezler devre dışı bırakılamaz.",
          },
          {
            name: "Performans Çerezleri",
            desc: "Ziyaretçi sayısı ve trafik kaynakları gibi anonim istatistikler toplar. Web sitemizin performansını ölçmemize ve iyileştirmemize yardımcı olur.",
          },
          {
            name: "İşlevsellik Çerezleri",
            desc: "Dil tercihi, kullanıcı ayarları gibi kişiselleştirme bilgilerini hatırlar. Bunlara izin vermezseniz bazı özellikler düzgün çalışmayabilir.",
          },
          {
            name: "Analitik Çerezler",
            desc: "Site kullanımını anlamamıza yardımcı olan Google Analytics gibi araçlar aracılığıyla anonim ziyaretçi verisi toplanır; yalnızca rızanız dahilinde etkinleştirilir.",
          },
        ].map((c) => (
          <div
            key={c.name}
            className="rounded-xl border border-zinc-100 bg-zinc-50 px-fluid-4 py-fluid-3"
          >
            <p className="text-[length:var(--text-xs)] font-semibold text-zinc-900">{c.name}</p>
            <p className="mt-fluid-1 text-[length:var(--text-xs)] leading-5 text-zinc-600">{c.desc}</p>
          </div>
        ))}
      </div>

      <SubHeading>Çerez Tercihlerinizi Yönetme</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz:
      </p>
      <div className="mt-fluid-3 grid gap-fluid-2 text-[length:var(--text-xs)] md:grid-cols-2">
        {[
          {
            name: "Google Chrome",
            path: "Ayarlar › Gizlilik ve Güvenlik › Çerezler",
          },
          {
            name: "Mozilla Firefox",
            path: "Seçenekler › Gizlilik ve Güvenlik › Çerezler",
          },
          {
            name: "Safari",
            path: "Tercihler › Gizlilik › Çerezler ve Web Sitesi Verileri",
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
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Zorunlu çerezlerin devre dışı bırakılması sitemizin temel işlevlerini
        olumsuz etkileyebilir.
      </p>

      {/* ── 4. Gizlilik Hakları ── */}
      <SectionHeading id="gizlilik-haklari">Gizlilik Hakları</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında
        aşağıdaki haklara sahipsiniz:
      </p>

      <div className="mt-fluid-4 space-y-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            title: "Bilgi Edinme Hakkı",
            desc: "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenen veriler hakkında bilgi talep etme ve verilerin kimlere aktarıldığını bilme.",
          },
          {
            title: "Erişim Hakkı",
            desc: "Kişisel verilerinize erişim talep etme ve verilerinizin bir kopyasını alma.",
          },
          {
            title: "Düzeltme Hakkı",
            desc: "Hatalı veya eksik kişisel verilerinizin düzeltilmesini talep etme.",
          },
          {
            title: "Silme Hakkı",
            desc: 'Belirli koşullar altında kişisel verilerinizin silinmesini talep etme ("unutulma hakkı").',
          },
          {
            title: "İşleme Sınırlandırma Hakkı",
            desc: "Belirli koşullar altında kişisel verilerinizin işlenmesini sınırlandırma.",
          },
          {
            title: "İtiraz Hakkı",
            desc: "Özellikle doğrudan pazarlama amacıyla işlenen veriler için kişisel verilerinizin işlenmesine itiraz etme.",
          },
          {
            title: "Onayı Geri Çekme Hakkı",
            desc: "Daha önce verdiğiniz herhangi bir onayı istediğiniz zaman geri çekme. Bu, geri çekme öncesi işlemlerin hukuki geçerliliğini etkilemez.",
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
        Yukarıdaki haklarınızı kullanmak için aşağıdaki kanallardan bize
        başvurabilirsiniz:
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
        Başvurunuzu aldıktan sonra talebinizi{" "}
        <strong className="font-semibold text-zinc-900">
          en geç 30 gün içinde
        </strong>{" "}
        ücretsiz olarak sonuçlandıracağız. İşlemin ayrıca bir maliyet
        gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu tarafından
        belirlenen tarifedeki ücret talep edilebilir.
      </p>

      {/* ── 5. Veri İhlali ── */}
      <SectionHeading id="veri-ihlali">Veri İhlali Bildirimi</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Olası bir veri ihlali durumunda şeffaflık ilkemiz doğrultusunda sizleri
        bilgilendirmek ve gerekli önlemleri almak için aşağıdaki süreci tâkib
        etmekteyiz.
      </p>

      <SubHeading>Veri İhlali Nedir?</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Veri ihlali; kişisel verilerin kazara veya yasadışı yollarla imha
        edilmesi, kaybolması, değiştirilmesi, yetkisiz şekilde ifşa edilmesi
        veya bunlara erişim sağlanması durumudur. Siber saldırılar, fiziksel
        güvenlik ihlalleri, insan hatası veya sistem arızaları gibi çeşitli
        nedenlerden kaynaklanabilir.
      </p>

      <SubHeading>Yönetim Süreci</SubHeading>
      <ol className="mt-fluid-3 space-y-fluid-4 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        {[
          {
            n: "1",
            title: "Tespit ve İlk Değerlendirme",
            desc: "Olası bir ihlal tespit edildiğinde kapsamını, etkilenen veri türlerini ve etkilenen kişi sayısını belirlemek için hızlı bir değerlendirme yapılır.",
          },
          {
            n: "2",
            title: "Yetkili Kurumlara Bildirim",
            desc: "Kişisel Verileri Koruma Kurumu'na (KVKK) ihlal tespit edildikten sonra en geç 72 saat içinde bildirimde bulunulur.",
          },
          {
            n: "3",
            title: "Etkilenenlere Bildirim",
            desc: "Veri ihlalinden etkilenen kişilere ihlalin niteliği, muhtemel sonuçları ve alınan önlemler hakkında açık ve anlaşılır bir dille bilgi verilir.",
          },
          {
            n: "4",
            title: "İyileştirme ve Önleme",
            desc: "İhlalin nedeni belirlenerek benzer ihlallerin tekrarlanmaması için gerekli teknik ve idari önlemler alınır; güvenlik politikaları gözden geçirilir.",
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
        Kişisel verilerinizle ilgili olası bir ihlalden şüpheleniyorsanız lütfen{" "}
        <a
          href="mailto:info@sultanokullari.com"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          info@sultanokullari.com
        </a>{" "}
        adresine e-posta gönderin veya{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim formunu
        </Link>{" "}
        kullanın.
      </p>

      {/* ── 6. Üçüncü Taraf ── */}
      <SectionHeading id="ucuncu-taraf">Üçüncü Taraf Hizmetler</SectionHeading>
      <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Web sitemizde kullandığımız bazı analitik teknolojiler dış hizmet
        sağlayıcıları tarafından sunulmaktadır. Bu teknolojiler yalnızca çerez
        tercihleri üzerinden verdiğiniz rıza doğrultusunda devreye alınır.
      </p>

      <SubHeading>Google Analytics</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Ziyaretçi davranışlarını anonim biçimde analiz etmek için{" "}
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Google Analytics
        </a>{" "}
        kullanıyoruz. Yalnızca rızanız dahilinde etkinleştirilir; topladığı
        veriler Google&#39;ın{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Gizlilik Politikası
        </a>
        &#39;na tabidir.
      </p>

      <SubHeading>Google Tag Manager</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Ölçümleme etiketlerini yönetmek için{" "}
        <a
          href="https://tagmanager.google.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Google Tag Manager
        </a>{" "}
        kullanıyoruz. Tag Manager yalnızca izin verdiğiniz etiketlerin
        çalıştırılmasını sağlar ve doğrudan kullanıcı verisi saklamaz.
      </p>

      <SubHeading>reCAPTCHA</SubHeading>
      <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        İletişim ve ön kayıt formlarında spam ve bot koruması amacıyla Google
        reCAPTCHA kullanılmaktadır. Bu hizmet kapsamında toplanan veriler
        Google&#39;ın gizlilik şartlarına tabidir.
      </p>

      <p className="mt-fluid-4 text-[length:var(--text-sm)] leading-7 text-zinc-700">
        Üçüncü taraf hizmet sağlayıcıları, veri işleme faaliyetlerinde kendi
        gizlilik politikalarına tabidir. Sorularınız için{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          bizimle iletişime
        </Link>{" "}
        geçebilirsiniz.
      </p>

      {/* Son güncelleme notu */}
      <p className="mt-fluid-8 text-[length:var(--text-xs)] text-zinc-400">
        Son güncelleme: Mayıs 2026 · Sultan Okulları, bu politikayı önceden
        haber vermeksizin güncelleyebilir. Değişiklikler web sitesinde
        yayımlandığı andan itibaren geçerlidir.
      </p>
    </PageShell>
  );
}
