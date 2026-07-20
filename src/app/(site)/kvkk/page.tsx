import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";

export const metadata = buildPageMetadata({
  path: "/kvkk",
  title: "KVKK Aydınlatma Metni",
  description:
    "Sultan Okulları Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni — 6698 sayılı KVKK kapsamında haklarınız ve veri işleme politikamız.",
});

const sections = [
  {
    id: "I",
    title: "Veri Sorumlusu",
    content: (
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        uyarınca kişisel verilerinizin işlenmesinden sorumlu veri sorumlusu{" "}
        <strong>Sultan Okulları</strong>&#39;dır. Başvuru ve iletişim
        kanallarımız bu metnin ilgili bölümünde ve{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim sayfamızda
        </Link>{" "}
        yer almaktadır. Web sitesi gizlilik uygulamaları için ayrıca{" "}
        <Link
          href="/gizlilik-politikasi"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Gizlilik Politikası
        </Link>
        nı inceleyebilirsiniz.
      </p>
    ),
  },
  {
    id: "II",
    title: "İşlenen Kişisel Veri Kategorileri",
    content: (
      <>
        <p>
          Faaliyetlerimizin niteliğine ve sizinle kurulan ilişkiye göre
          aşağıdaki kategorilerdeki kişisel veriler işlenebilir:
        </p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>
            <strong>Kimlik:</strong> ad, soyad, T.C. kimlik numarası ve benzeri
            kimlik bilgileri
          </li>
          <li>
            <strong>İletişim:</strong> telefon, e-posta, adres
          </li>
          <li>
            <strong>Öğrenci / veli bilgileri:</strong> kayıt ve ön kayıt
            bilgileri, sınıf/kademe, eğitim-öğretim süreçlerine ilişkin kayıtlar
          </li>
          <li>
            <strong>Özel nitelikli kişisel veriler:</strong> sağlık bilgileri
            gibi veriler yalnızca ilgili mevzuatın öngördüğü hâllerde ve KVKK
            md. 6 şartlarına uygun olarak (örneğin açık rıza veya kanunî
            istisnalar çerçevesinde) işlenir
          </li>
          <li>
            <strong>İşlem güvenliği / kullanım verileri:</strong> web sitesi
            üzerinden iletilen form içerikleri; teknik güvenlik ve hizmet
            sunumu için gerekli IP adresi, tarayıcı ve oturum bilgileri
          </li>
        </ul>
        <p className="mt-3">
          Web sitemizde yer alan öğrenci, öğretmen, veli veya sınıf/ders
          atmosferini yansıtan görseller yapay zekâ ile üretilmiş sentetik
          görsellerdir; gerçek üçüncü kişi fotoğrafları kullanılmamaktadır.
          Ayrıntı için aşağıdaki &quot;Yapay Zekâ ile Üretilmiş Görseller&quot;
          bölümüne bakınız.
        </p>
      </>
    ),
  },
  {
    id: "III",
    title: "Toplama Yöntemi ve Hukuki Sebepler",
    content: (
      <p>
        Kişisel verileriniz; ön kayıt / bilgi talep formları, iletişim formu,
        insan kaynakları başvuruları, yüz yüze veya telefon görüşmeleri, yazılı
        belgeler ve elektronik yazışmalar yoluyla; kısmen veya tamamen otomatik
        ya da otomatik olmayan yollarla toplanabilir. Veriler fiziki ve/veya
        dijital ortamlarda muhafaza edilir. İşleme faaliyetleri, KVKK&#39;nın
        temel ilkelerine ve md. 5 ile (özel nitelikli veriler bakımından) md. 6
        hükümlerinde sayılan şartlara dayanır. Açık rıza gerektiren işlemlerde
        rızanız ayrıca alınır; sözleşmenin kurulması/ifası, kanunî
        yükümlülüklerin yerine getirilmesi, bir hakkın tesisi, kullanılması veya
        korunması ve meşru menfaat gibi şartlar da ilgili hâllerde hukuki sebep
        oluşturabilir.
      </p>
    ),
  },
  {
    id: "IV",
    title: "Kişisel Verilerin İşlenme Amaçları",
    content: (
      <>
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenebilir:</p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>
            Kayıt, ön kayıt ve eğitim-öğretim süreçlerini yürütmek ve ilgili
            mevzuata (Millî Eğitim Bakanlığı düzenlemeleri dâhil) uygunluğu
            sağlamak
          </li>
          <li>
            Veli iletişimi, toplantı, etkinlik ve okul içi bilgilendirme
            süreçlerini yönetmek
          </li>
          <li>
            Taleplerinize yanıt vermek; bilgi, etkinlik ve hizmetlerle ilgili
            bilgilendirme yapmak
          </li>
          <li>
            Okul güvenliği ile öğrenci sağlığına ilişkin zorunlu süreçleri
            planlamak ve uygulamak
          </li>
          <li>
            Hizmet kalitesini artırmak amacıyla kimliği ifşa edilmeden
            istatistiksel değerlendirme yapmak
          </li>
          <li>
            Veri güvenliğini sağlamak; yedekleme ve teknik işletim
            faaliyetlerini yürütmek
          </li>
          <li>
            Ticari elektronik ileti göndermek (yalnızca ilgili mevzuata uygun
            şekilde ve gerekli onaylar alınmak kaydıyla)
          </li>
          <li>Yasal yükümlülükleri yerine getirmek ve yetkili mercilere bilgi vermek</li>
        </ul>
      </>
    ),
  },
  {
    id: "V",
    title: "Kişisel Verilerin Aktarılması",
    content: (
      <p>
        Toplanan kişisel verileriniz; KVKK&#39;nın 8. maddesi (ve yurt dışı
        aktarım söz konusu olduğunda 9. maddesi) çerçevesinde, yalnızca işleme
        amaçlarıyla sınırlı ve gerekli olduğu ölçüde; hizmet aldığımız
        tedarikçi ve servis sağlayıcılara (örneğin barındırma, e-posta,
        güvenlik/doğrulama hizmetleri), kanunen yetkili kamu kurum ve
        kuruluşlarına ve eğitim faaliyetinin gerektirdiği diğer muhataplara
        aktarılabilir. Yurt dışına aktarım, ancak kanunun aradığı şartların
        sağlanması hâlinde gerçekleştirilir.
      </p>
    ),
  },
  {
    id: "VI",
    title: "Saklama Süresi",
    content: (
      <p>
        Kişisel verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve
        ilgili mevzuatta öngörülen zamanaşımı / saklama süreleri saklı kalmak
        kaydıyla muhafaza edilir. İşlenmesini gerektiren sebep ortadan
        kalktığında KVKK md. 7 uyarınca silinir, yok edilir veya
        anonimleştirilir.
      </p>
    ),
  },
  {
    id: "VII",
    title: "KVKK Madde 11 Kapsamındaki Haklarınız",
    content: (
      <>
        <p>Kişisel veri sahibi olarak KVKK md. 11 uyarınca:</p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>
            İşlenme amacını ve bunların amacına uygun kullanılıp
            kullanılmadığını öğrenme,
          </li>
          <li>
            Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
          </li>
          <li>
            Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme ve
            bu kapsamda yapılan işlemin aktarıldığı üçüncü kişilere
            bildirilmesini isteme,
          </li>
          <li>
            KVKK ve ilgili mevzuata uygun işlenmiş olmasına rağmen işlenmesini
            gerektiren sebeplerin ortadan kalkması hâlinde silinmesini veya yok
            edilmesini isteme ve bu kapsamda yapılan işlemin üçüncü kişilere
            bildirilmesini isteme,
          </li>
          <li>
            Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle
            aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
          </li>
          <li>
            Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın
            giderilmesini talep etme
          </li>
        </ul>
        <p className="mt-3">haklarına sahipsiniz.</p>
      </>
    ),
  },
  {
    id: "VIII",
    title: "Haklarınızı Nasıl Kullanabilirsiniz?",
    content: (
      <p>
        Yukarıdaki haklarınızı kullanmak için{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim formumuzu
        </Link>{" "}
        doldurabilir,{" "}
        <a
          href="mailto:info@sultanokullari.com"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          info@sultanokullari.com
        </a>{" "}
        adresine e-posta gönderebilir veya yazılı olarak (şahsen ya da iadeli
        taahhütlü posta ile) başvurabilirsiniz. Başvurular, talebin niteliğine
        göre en kısa sürede ve en geç otuz (30) gün içinde sonuçlandırılır;
        kural olarak ücretsizdir. İşlemin ayrıca bir maliyet gerektirmesi
        hâlinde Kişisel Verileri Koruma Kurulu tarafından belirlenen tarife
        uygulanabilir. Kimlik doğrulaması için ek bilgi istenebilir.
      </p>
    ),
  },
  {
    id: "IX",
    title: "Çerezler ve Elektronik Ortam",
    content: (
      <p>
        Web sitemizde zorunlu çerezler ve teknik güvenlik araçları (örneğin form
        spam koruması) kullanılabilir; analitik veya benzeri isteğe bağlı
        araçlar kullanılması hâlinde bunlar ilgili mevzuata uygun şekilde
        yönetilir. Çerez türleri, üçüncü taraf hizmetler ve tercihlerinizi
        yönetme yolları{" "}
        <Link
          href="/gizlilik-politikasi#cerezler"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Gizlilik Politikası — Çerezler
        </Link>{" "}
        bölümünde açıklanmıştır.
      </p>
    ),
  },
  {
    id: "X",
    title: "Yapay Zekâ ile Üretilmiş Görseller",
    content: (
      <p>
        Bu web sitesinde yer alan; öğrenci, öğretmen, veli/aile ve sınıf, ders
        veya okul yaşamı atmosferini gösteren görsellerin tamamı yapay zekâ
        (AI) teknolojileri ile üretilmiş sentetik görsellerdir. Gerçek üçüncü
        kişilere ait öğrenci, öğretmen veya veli fotoğrafları kullanılmamaktadır.
        Bu görseller tanıtım ve illüstrasyon amacı taşır; herhangi bir gerçek
        kişinin kimliğini temsil etmez ve bu kapsamda kişisel veri teşkil
        etmez. Kurumsal logo, grafik ve benzeri marka unsurları bu bildirimin
        kapsamı dışındadır.
      </p>
    ),
  },
];

export default function Page() {
  return (
    <PageShell
      title="Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni"
      intro="Sultan Okulları olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla kişisel verilerinizi hangi kapsamda işlediğimizi aşağıda açıklamaktayız."
    >
      <div className="mt-fluid-2 space-y-fluid-8">
        {sections.map((section) => (
          <section key={section.id} id={`bolum-${section.id.toLowerCase()}`}>
            <h2 className="flex items-baseline gap-fluid-2 text-[length:var(--text-base)] font-semibold text-zinc-900 md:text-[length:var(--text-lg)]">
              <span className="shrink-0 text-[length:var(--text-xs)] font-bold tracking-widest text-[var(--color-primary)] uppercase">
                {section.id}.
              </span>
              {section.title}
            </h2>
            <div className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700 md:text-[length:var(--text-base)]">
              {section.content}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)]/40 p-fluid-4 md:p-fluid-6">
          <p className="text-[length:var(--text-xs)] font-semibold tracking-widest text-[var(--color-primary)] uppercase">
            Veri Sorumlusu / Başvuru
          </p>
          <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-6 text-zinc-800">
            <strong>Sultan Okulları</strong> — Sorularınız veya KVKK
            başvurularınız için{" "}
            <Link
              href="/iletisim"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              iletişim sayfamızı
            </Link>{" "}
            ziyaret edebilir ya da{" "}
            <a
              href="mailto:info@sultanokullari.com"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              info@sultanokullari.com
            </a>{" "}
            adresine e-posta gönderebilirsiniz.
          </p>
        </div>

        <p className="text-[length:var(--text-xs)] text-zinc-400">
          Son güncelleme: Temmuz 2026 · Bu aydınlatma metni gerektiğinde
          güncellenebilir; güncel metin web sitesinde yayımlandığı andan
          itibaren geçerlidir.{" "}
          <Link
            href="/gizlilik-politikasi"
            className="font-medium text-[var(--color-primary)]/80 hover:underline"
          >
            Gizlilik Politikası
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
